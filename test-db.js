require('dotenv').config();
const { Client } = require("pg");

const client = new Client(process.env.DATABASE_URL);

(async () => {
  await client.connect();
  try {
    const results = await client.query("SELECT NOW()");
    console.log("Connection successful!");
    console.log("Current time from DB:", results.rows[0]);
  } catch (err) {
    console.error("error executing query:", err);
  } finally {
    client.end();
  }
})();
