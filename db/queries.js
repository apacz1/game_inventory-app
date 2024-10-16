const pool = require("./pools");

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

module.exports = { getAllGenres };
