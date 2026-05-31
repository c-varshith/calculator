require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL)
{
  throw new Error('DATABASE_URL is required to connect to the database');
}

const useSsl = process.env.DATABASE_SSL !== 'false';
const pool = new Pool
({
  connectionString: process.env.DATABASE_URL,
  ...(useSsl
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {})
});

// Save calculation
async function saveCalculation(a, operator, b, result)
{
  await pool.query
  (
    'INSERT INTO history (a, operator, b, result) VALUES ($1, $2, $3, $4)',
    [a, operator, b, result]
  );
  await pool.query
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
  const result = await pool.query
  (
    'SELECT * FROM history ORDER BY id DESC LIMIT 50'
  );
  return result.rows;
}

// Clear history
async function clearHistory()
{
  await pool.query('DELETE FROM history');
}

module.exports =
{
  saveCalculation,
  getHistory,
  clearHistory,
};
