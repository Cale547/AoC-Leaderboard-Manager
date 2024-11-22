const { Client } = require('pg');

async function queryDatabase(query, params) {
    const client = new Client({
        user: process.env.pcgUser,
        password: process.env.pcgPass,
        host: process.env.pcgHost,
        port: process.env.pcgPort,
        database: process.env.pcgDatabase,
      });

      client.connect();
    try {
      const res = await client.query(query, params);
      console.log(res.rows);
      return objToRowArray(res.rows);
    } catch (err) {
      console.error('Database query error:', err);
      throw err;
    } finally {
      client.end();
    }
}

function objToRowArray(obj) {      
  // Convert data to formatted string
  const rowArray = obj.map(({ row }) => {
    // Remove parentheses and split into components
    const formattedRow = row.slice(1, -1).split(',');
    return formattedRow;
    }); // Join each formatted row with a newline
  return rowArray;

}

module.exports = { queryDatabase };