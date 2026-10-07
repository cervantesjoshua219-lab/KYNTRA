# How SQL queries work in the KYNTRA code and database

A walkthrough of Laboratory Exercise 05: every query in `src/services/db.ts`,
how it reaches the SQLite engine, and what happens to the row on the way back.

---

## 1. The big picture

One table (`products`), opened as a lazy singleton, seeded once, read everywhere.

```
Screen (Shop, Inventory, Product page…)
      │  async: productService.listAll() / search() / getById()…
      ▼
src/services/productService.ts     ← keeps the artificial delay(), hides SQL
      ▼  sync: listProducts() / searchProducts() / findProduct()…
src/services/db.ts                 ← ALL SQL lives here
      ▼
expo-sqlite  (openDatabaseSync on Android / openDatabaseAsync on web)
      ▼
SQLite engine  (native libsqlite3 on Android, wa-sqlite wasm in a worker on web)
      ▼
pos_inventory.db file on disk (app-private storage, WAL mode)
```

The file on disk is `<app data dir>/files/SQLite/pos_inventory.db`. While it is
open you will also see `pos_inventory.db-wal` and `-shm` next to it — those are
the write-ahead log and its index, described in §9.

---

## 2. Connection lifecycle — one database, opened once

`db.ts` keeps a module-level singleton:

```ts
let cached: SQLiteDatabase | null = null;
let initPromise: Promise<SQLiteDatabase> | null = null;
```

- `initDatabase()` opens the database **once** (`openDatabaseSync` on Android —
  the lab's exact call), applies the schema, seeds if empty, and stores the
  handle in `cached`. The root layout `await`s it before any screen mounts, so
  no read can race the seed.
- `getDatabase()` returns the cached handle synchronously for render-time reads
  (`ListHeader` counts, `useState(() => listProducts())` lazy initialisers).
  On web it throws if init hasn't resolved yet, because there the sync API only
  works after the wasm worker handshake (see §10).

Why a singleton instead of React context? `productService`, `CartProvider` and
the order screens are plain modules that want to answer "what is this product"
synchronously; threading a provider handle through every one of them would be
more plumbing than the table is worth.

---

## 3. The schema, explained

```sql
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS products (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,   -- the lab's integer PK
  slug             TEXT    NOT NULL UNIQUE,             -- the app's stable key
  name             TEXT    NOT NULL,
  category         TEXT    NOT NULL,
  price            REAL    NOT NULL,
  stock            INTEGER NOT NULL DEFAULT 0,
  tagline          TEXT    NOT NULL DEFAULT '',
  description      TEXT    NOT NULL DEFAULT '',
  sport            TEXT,
  collection       TEXT,
  compare_at_price REAL,
  image_keys       TEXT    NOT NULL DEFAULT '[]',
  sizes            TEXT    NOT NULL DEFAULT '[]',
  colors           TEXT    NOT NULL DEFAULT '[]',
  rating           REAL    NOT NULL DEFAULT 0,
  review_count     INTEGER NOT NULL DEFAULT 0,
  featured         INTEGER NOT NULL DEFAULT 0,
  is_new           INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_products_name     ON products (name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_sport    ON products (sport);
```

Why this shape:

- **`id` and `slug` both exist.** The lab specifies `id INTEGER PRIMARY KEY
  AUTOINCREMENT`, so it is there. But the app's `Product.id` is a *string* that
  things already rely on — the `/product/<id>` route, the `reviews` lookup, and
  every cart, favourite and order persisted to AsyncStorage. Those reference the
  slug. So `id` is the database's own row key and `slug` is the application key,
  and both are unique/indexed.
- **Every `Product` field is a column.** A row round-trips losslessly; nothing
  is reconstructed from a side table. `sizes`/`colors`/`image_keys` are JSON
  *strings* because SQLite has no array type — they are parsed back into arrays
  at read time (§6).
- **Booleans are `INTEGER` 0/1.** SQLite has no boolean type; `featured === 1`
  and `is_new === 1` do the conversion in `toProduct`.
- **The three indexes** cover what the app actually filters or sorts by:
  category chips (`idx_products_category`), sport chips (`idx_products_sport`),
  and name (`idx_products_name … COLLATE NOCASE`, which the `ORDER BY name`
  in the search query can use).
- **`PRAGMA journal_mode = WAL`** switches SQLite to write-ahead logging:
  writes go to a `-wal` append-only file that is periodically checkpointed back
  into the main `.db`. Readers never block the writer and vice-versa, and a
  crash mid-write cannot corrupt the main file — this is the durability setting
  the exercise asks for.

The whole block runs as a single `execSync`, exactly as the guide describes.

---

## 4. How a query actually executes

Every SQLite query goes through the same four phases. The convenience methods
used here (`getAllSync`, `getFirstSync`, `runSync`) do all four for you; they
are thin wrappers around prepared statements:

1. **`prepare`** — SQLite compiles the SQL text into an internal bytecode
   program (`sqlite3_prepare_v2`). This is also where the `?` placeholders get
   their numbered slots.
2. **`bind`** — each parameter is bound to a slot (`sqlite3_bind_text`, …).
   This is what makes a query **parameterised**: the values are data handed to
   the engine, never text spliced into the SQL string. SQLite escapes/encodes
   them itself, which is the defence against injection — and the bytecode can
   be reused with different bound values.
3. **`step`** — the engine runs the program. For a `SELECT` each `step` returns
   one row (`SQLITE_ROW`) until done (`SQLITE_DONE`); for writes it applies the
   change.
4. **`finalize`** — the statement is freed.

For example, `runSync(sql, params)` is: prepare → bind the array → step once →
return `{ changes, lastInsertRowId }`. `getAllSync` additionally loops `step`
collecting every row into an array of objects. Both finalize the statement even
when the query throws.

**Answers come back as plain objects keyed by column name** — `{ slug: 'contr-02',
price: 4990, … }` — then mapped to the app's `Product` type (§6).

---

## 5. Every query in `db.ts`, annotated

### 5.1 Schema + WAL (startup)

```ts
db.execSync(SCHEMA);   // §3 — multi-statement, runs once per open (idempotent)
```

`execSync` runs whatever SQL text it is given, atomically per statement. It is
used only for this fixed, non-parameterised schema — never for user input.

### 5.2 `listProducts()` — full table, Figma order

```ts
getAllSync<Row>('SELECT * FROM products ORDER BY id ASC')
```

- `SELECT *` returns every column; `ORDER BY id ASC` keeps the order the rows
  were inserted, which preserves the order the six Figma products were seeded
  in (alphabetical sort would reshuffle the approved Shop layout).
- The `<Row>` generic types the returned objects as the snake_case row shape.

### 5.3 `searchProducts(term)` — the lab's parameterised `LIKE ?`

```ts
const pattern = `%${trimmed.replace(/[%_\\]/g, '')}%`;

getAllSync<Row>(
  `SELECT * FROM products
    WHERE name        LIKE ?
       OR tagline     LIKE ?
       OR category    LIKE ?
       OR sport       LIKE ?
       OR description LIKE ?
    ORDER BY name COLLATE NOCASE`,
  [pattern, pattern, pattern, pattern, pattern],
)
```

- **One `%term%` pattern, bound five times** to five separate `?` placeholders —
  nothing is interpolated into the SQL string. That is the parameterised search
  the rubric requires.
- **Why `%…%`?** `LIKE` matches whole values; `%` is the "any run of
  characters" wildcard. `%cap%` matches *"cap"* anywhere in the value —
  so *"Airweave Cap"* matches, and so does *"Running"* in the `sport` column.
- **`LIKE` is case-insensitive for ASCII by default**, so "CAP" and "cap" hit
  the same rows.
- **The wildcards are stripped from the term first**: `replace(/[%_\\]/g,'')`.
  `%` and `_` are SQL wildcards; a user searching `50% off` would otherwise turn
  the query into *match everything*, so they are removed to keep the search
  literal. (Backslash is stripped too because the code doesn't use an `ESCAPE`
  clause.)
- **`ORDER BY name COLLATE NOCASE`** puts results in case-insensitive name
  order, which can use the `(name COLLATE NOCASE)` index.

Empty term → `listProducts()` (full list, no query).

### 5.4 `findProduct(slug)` — one row by app key

```ts
getFirstSync<Row>('SELECT * FROM products WHERE slug = ?', [slug])
```

`getFirstSync` returns the first row or `null`. Used by the product page, the
detail screen and — importantly — *everywhere a cart/saved/order references a
product id*, so those persisted features keep working against the table.

### 5.5 `listCategories()` — distinct values

```ts
getAllSync('SELECT DISTINCT category FROM products ORDER BY category COLLATE NOCASE')
```

Powers the Add Item form's category selector from what is *actually in the
table* — a category added in the lab shows up as a choice with no code change.

### 5.6 `countProducts(db)` — the seed guard

```ts
db.getFirstSync<{ total: number }>('SELECT COUNT(*) AS total FROM products')
```

`COUNT(*)` returns a single row with one column; `AS total` names it so the
result is `{ total: 6 }`. Used by `seedIfEmpty` to decide whether to seed.

### 5.7 The INSERT (seeding and Add Item)

```ts
const INSERT = `
INSERT INTO products (
  slug, name, category, price, stock, tagline, description,
  sport, collection, compare_at_price, image_keys, sizes, colors,
  rating, review_count, featured, is_new
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
```

`INSERT` lists 17 columns and 17 `?` placeholders. Column order in the
`VALUES` must match the parameter array order exactly — for the seeder, that
array is built from the seed product's fields:

```ts
db.runSync(INSERT, [
  product.id,                        // slug
  product.name,
  product.category,
  product.price,
  product.stock,
  product.tagline,
  product.description,
  product.sport ?? null,             // nullable columns get explicit null
  product.collection ?? null,
  product.compareAtPrice ?? null,
  JSON.stringify(sourcesToKeys(product.images)),  // arrays → JSON strings
  JSON.stringify(product.sizes),
  JSON.stringify(product.colors),
  product.rating,
  product.reviewCount,
  product.featured ? 1 : 0,          // booleans → 0/1
  product.isNew ? 1 : 0,
]);
```

Notes:

- `AUTOINCREMENT` assigns `id`; the app never supplies it.
- **Images are stored as keys** (`"paceform01"`), not `require()` results —
  asset ids change on every rebuild, so storing them would poison a table meant
  to outlive rebuilds. `sourcesToKeys`/`keysToSources` bridge the registry at
  write/read time.
- `runSync` returns `{ changes, lastInsertRowId }`; the code doesn't need
  `lastInsertRowId` because it reads back by slug instead (§7).

### 5.8 `updateProduct(slug, input)` — the UPDATE

```ts
db.runSync(
  'UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE slug = ?',
  [input.name.trim(), input.category.trim(), input.price,
   Math.max(0, Math.trunc(input.stock)), slug],
)
```

- The four editable fields are re-bound per `?`; `WHERE slug = ?` targets the
  row by application key.
- **The slug is never part of the `SET` list.** Renaming a product does not
  re-key the row — the `/product/<slug>` route, carts, saved items and orders
  that reference it keep pointing at the same row, which now simply renders
  the new name and figures.
- The result's `.changes` decides the return: `> 0` means a row was actually
  touched, and the fresh row is read back with `findProduct(slug)`.

### 5.9 `uniqueSlug(db, name)` — existence probe

```ts
for (let n = 2; db.getFirstSync('SELECT 1 FROM products WHERE slug = ?', [slug]); n++) {
  slug = `${base}-${n}`;
}
```

`SELECT 1` is the classic "does this row exist?" probe — it returns a row
(which is just the literal `1`) when the slug is taken, `null` otherwise, and
transfers no data. Adding a second "Paceform 01" becomes `paceform-01-2`
instead of failing the `UNIQUE` constraint.

### 5.10 `deleteProduct(slug)` — the delete

```ts
db.runSync('DELETE FROM products WHERE slug = ?', [slug]).changes > 0
```

`DELETE` removes the matched rows; `.changes` reports how many were removed.
`> 0` turns that into a boolean so the screen knows a row actually went away.

---

## 6. Row → app object: `toProduct`

SQLite rows use snake_case, JSON strings and 0/1 integers; the app expects
camelCase, arrays, booleans and asset sources. `toProduct` is the translator:

```ts
{
  id: row.slug,                      // ← the app key is the slug, not row.id
  name: row.name,
  price: row.price,
  compareAtPrice: row.compare_at_price ?? undefined,
  images: keysToSources(row.image_keys),   // JSON string → [asset sources]
  sizes: parse(row.sizes, []),             // JSON string → []
  colors: parse(row.colors, []),
  featured: row.featured === 1,            // int → boolean
  reviewCount: row.review_count,
  ...
}
```

Key flips:

| SQL column | → | Product field | change |
|---|---|---|---|
| `slug` | → | `id` | string key the rest of the app uses |
| `image_keys` / `sizes` / `colors` | → | `images` / `sizes` / `colors` | `JSON.parse` into arrays |
| `featured` / `is_new` | → | booleans | `=== 1` |
| `compare_at_price` / `sport` / `collection` | → | optionals | `?? undefined` |

---

## 7. Worked example — adding "Trail Sock" from the Inventory screen

1. The Add Item sheet collects `name = "Trail Sock"`, `category = "Apparel"`,
   `price = 250`, `stock = 30` → `createProduct({…})`.
2. `uniqueSlug` runs `SELECT 1 FROM products WHERE slug = 'trail-sock'` (there
   is no match) and settles on `trail-sock`.
3. `runSync(INSERT, [trail-sock, 'Trail Sock', 'Apparel', 250, 30, '', …, 0, 0, 0, 0])`
   writes the row — SQLite assigns `id = 7`.
4. `createProduct` reads the row straight back with
   `findProduct('trail-sock')` (`SELECT * FROM products WHERE slug = ?`),
   maps it through `toProduct`, and returns it; the sheet closes and the list
   re-renders via `listProducts()` → the header now says `7 items`.
5. Reload the app: `initDatabase()` reopens the same file, `countProducts()`
   returns 7, **the seed guard skips**, and Trail Sock is still on the screen.
   That is the whole point of the exercise — the screen no longer renders a
   static array.
6. From Inventory, tap the pencil on Trail Sock, change the stock to 50 and the
   name to "Trail Sock Pro", and save: `updateProduct` runs the `UPDATE`, the
   row keeps slug `trail-sock`, and the list re-renders with the new name and
   stock figure. The `/product/trail-sock` route still works — re-keying never
   happens.

---

## 8. How SQLite behaves between the statements

- **Transactions**: each `runSync`/`getAllSync` is its own implicit
  transaction (autocommit). The seeding loop inserts six rows in six autocommit
  transactions — fine here because it runs once and the guard makes partial
  states recoverable.
- **Ordering**: `ORDER BY id ASC` preserves insertion order; `ORDER BY name
  COLLATE NOCASE` sorts case-insensitively; `ORDER BY category … NOCASE` keeps
  `Accessories, Apparel, Shoes` readable.
- **`COLLATE NOCASE` on a column** tells SQLite to compare ASCII text
  case-insensitively for that column/index — why `WHERE slug = ?` matches the
  stored lowercase slug exactly, and why the name index sorts "Airweave Cap"
  and "driftline short" together.

---

## 9. Durability: WAL, and why reloads survive

With `journal_mode = WAL`:

- Writes append to `pos_inventory.db-wal`; a checkpoint folds them back into
  `pos_inventory.db` (automatically at intervals and on clean close).
- A reader sees a consistent snapshot even while a writer is mid-transaction.
- After a process kill or reload, the WAL is replayed/checkpointed on the next
  open — no lost rows, no torn pages.

So "survives a reload" is not a promise the app makes up: it is the WAL
guarantee plus `AUTOINCREMENT` ids and the count-guarded seed.

---

## 10. Android vs web engine (why there is one platform branch)

- **Android (shipped target)**: `openDatabaseSync` is a genuinely synchronous
  native call — the blueprint's exact line. Queries run in the C `libsqlite3`;
  results come back as native objects. No worker, no serialization.
- **Web (dev-check target only)**: expo-sqlite runs inside a Web Worker that
  first fetches and compiles `wa-sqlite` (a ~600 KB wasm file — hence the
  `metro.config.js` `assetExts.push('wasm')`). The *sync* API busy-waits
  without yielding, so a cold worker throws "Sync operation timeout". The code
  therefore opens the web DB once with `openDatabaseAsync` (which performs that
  handshake), then lets `getDatabase()` serve the sync reads the same code path
  uses. Everything in this document is about the SQL, which is identical on
  both; only the opener differs.

---

## 11. Terms, in one line each

| Term | Meaning |
|---|---|
| `prepare` | Compile SQL text into reusable bytecode with `?` slots |
| `bind` | Attach parameter values to the slots (never string interpolation) |
| `step` | Execute; yields one row per call for a `SELECT` |
| `finalize` | Free the statement |
| `runSync` | Write/read-any: returns `{ changes, lastInsertRowId }` |
| `getFirstSync` | Run; return first row or `null` |
| `getAllSync` | Run; return every row as an array of objects |
| `LIKE` | Pattern match; `%` = any run, case-insensitive (ASCII) by default |
| `COLLATE NOCASE` | Compare/sort text without case sensitivity |
| `PRAGMA journal_mode = WAL` | Write-ahead log: durable, concurrent, no reader blocking |
| `changes` / `lastInsertRowId` | Rows affected / id of the last insert, from the run result |
| `AUTOINCREMENT` | Monotonic row ids, never reused |