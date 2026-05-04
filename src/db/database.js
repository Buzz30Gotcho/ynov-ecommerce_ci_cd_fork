const initSqlJs = require('sql.js');

let db;
let SQL;

async function initDatabase() {
    SQL = await initSqlJs();
    db = new SQL.Database();
    console.info('✓ SQLite database initialized (in-memory)');
    return db;
}

function closeDatabase() {
    if (db) {
        db.close();
    }
    return Promise.resolve();
}

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        try {
            db.run(sql, params);
            // Pour INSERT, UPDATE, DELETE on retourne un ID fictif
            const result = db.exec('SELECT last_insert_rowid() as id');
            const id = result[0]?.values[0]?.[0] || Math.floor(Math.random() * 10000);
            resolve({ id, changes: 1 });
        } catch (err) {
            reject(err);
        }
    });
}

function getAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        try {
            const stmt = db.prepare(sql);
            stmt.bind(params);
            if (stmt.step()) {
                const row = stmt.getAsObject();
                stmt.free();
                resolve(row);
            } else {
                stmt.free();
                resolve(undefined);
            }
        } catch (err) {
            reject(err);
        }
    });
}

function allAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        try {
            const stmt = db.prepare(sql);
            stmt.bind(params);
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            resolve(rows);
        } catch (err) {
            reject(err);
        }
    });
}

async function initializeTables() {
    await runAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category TEXT DEFAULT 'misc'
    )
  `);

    await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT DEFAULT 'customer'
    )
  `);

    await runAsync(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      total REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

    console.info('✓ Tables initialized');
}

module.exports = {
    initDatabase,
    closeDatabase,
    runAsync,
    getAsync,
    allAsync,
    initializeTables,
};
