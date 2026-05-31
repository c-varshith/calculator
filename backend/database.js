require('dotenv').config();
const dns = require('dns');
const { Pool } = require('pg');
const { URL } = require('url');

if (!process.env.DATABASE_URL)
{
  throw new Error('DATABASE_URL is required to connect to the database');
}

const useSsl = process.env.DATABASE_SSL !== 'false';
let pool;

async function getPool()
{
  if (pool)
  {
    return pool;
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);
  const resolvedHost = await dns.promises.lookup(databaseUrl.hostname, { family: 4 });

  databaseUrl.hostname = resolvedHost.address;

  pool = new Pool
  ({
    connectionString: databaseUrl.toString(),
    ...(useSsl
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {})
  });

  return pool;
}

// Save calculation
async function saveCalculation(a, operator, b, result)
{
  const databasePool = await getPool();

  await databasePool.query
  (
    'INSERT INTO history (a, operator, b, result) VALUES ($1, $2, $3, $4)',
    [a, operator, b, result]
  );
  await databasePool.query
  (`
    DELETE FROM history
    WHERE id < (
      SELECT id FROM history
      ORDER BY id DESC
      OFFSET 50 LIMIT 1
    );
  `);
}

// Get last 50 calculations
async function getHistory()
{
  const databasePool = await getPool();

  const result = await databasePool.query
  (
    'SELECT * FROM history ORDER BY id DESC LIMIT 50'
  );
  return result.rows;
}

// Clear history
async function clearHistory()
{
  const databasePool = await getPool();

  await databasePool.query('DELETE FROM history');
}

module.exports =
{
  saveCalculation,
  getHistory,
  clearHistory,
};
