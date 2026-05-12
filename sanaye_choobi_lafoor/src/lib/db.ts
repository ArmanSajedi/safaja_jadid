import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import initSqlJs from 'sql.js';
import { drizzle } from 'drizzle-orm/sql-js';

import { posts, hosts, villas } from './schema';

const databasePath = path.join(process.cwd(), 'prisma', 'dev.db');
const databaseDirectory = path.dirname(databasePath);

if (!existsSync(databaseDirectory)) {
  mkdirSync(databaseDirectory, { recursive: true });
}

let initializedDb: ReturnType<typeof drizzle> | null = null;
let sqliteDatabaseInstance: InstanceType<import('sql.js').DatabaseConstructor> | null = null;
let initialising: Promise<void> | null = null;

const loadDatabase = async () => {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
  });

  let sqliteDatabase;

  if (existsSync(databasePath)) {
    const fileBuffer = readFileSync(databasePath);
    sqliteDatabase = new SQL.Database(new Uint8Array(fileBuffer));
  } else {
    sqliteDatabase = new SQL.Database();
  }

  sqliteDatabaseInstance = sqliteDatabase;

  sqliteDatabase.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      title text NOT NULL,
      slug text NOT NULL UNIQUE,
      excerpt text NOT NULL,
      content text NOT NULL,
      image_url text,
      tags text NOT NULL DEFAULT '[]',
      author text NOT NULL,
      published integer NOT NULL DEFAULT 0,
      published_at text,
      created_at text NOT NULL,
      updated_at text NOT NULL
    );
  `);
  sqliteDatabase.exec(`
    CREATE TABLE IF NOT EXISTS hosts (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      first_name text NOT NULL,
      last_name text NOT NULL,
      phone text NOT NULL,
      national_id text,
      address text,
      city text,
      province text,
      status text NOT NULL DEFAULT 'pending',
      documents_status text NOT NULL DEFAULT 'not_submitted',
      national_id_image text,
      ownership_doc_image text,
      created_at text NOT NULL,
      updated_at text NOT NULL
    );
  `);
  sqliteDatabase.exec(`
    CREATE TABLE IF NOT EXISTS villas (
      id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      host_id integer NOT NULL,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      location text NOT NULL,
      category text NOT NULL,
      description text NOT NULL,
      price integer NOT NULL,
      original_price integer,
      rating real NOT NULL DEFAULT 0,
      reviews_count integer NOT NULL DEFAULT 0,
      discount integer NOT NULL DEFAULT 0,
      is_new integer NOT NULL DEFAULT 0,
      status text NOT NULL DEFAULT 'pending_review',
      images text NOT NULL DEFAULT '[]',
      amenities text NOT NULL DEFAULT '[]',
      access text NOT NULL DEFAULT '[]',
      rules text NOT NULL DEFAULT '',
      specifications text NOT NULL DEFAULT '{}',
      stock integer NOT NULL DEFAULT 1,
      created_at text NOT NULL,
      updated_at text NOT NULL,
      published_at text
    );
  `);

  initializedDb = drizzle(sqliteDatabase, { schema: { posts, hosts, villas } });

  return sqliteDatabase;
};

export const getDb = async () => {
  if (initializedDb) {
    return initializedDb;
  }

  if (!initialising) {
    initialising = loadDatabase().then(() => undefined);
  }

  await initialising;
  return initializedDb as NonNullable<typeof initializedDb>;
};

export const persistDb = async () => {
  await getDb();

  if (!sqliteDatabaseInstance) {
    throw new Error('Database instance is not initialized');
  }

  const exported = sqliteDatabaseInstance.export();
  writeFileSync(databasePath, Buffer.from(exported));
};
