const pool = require("./pools");

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getGenreByName(genreName) {
  const { rows } = await pool.query(
    `SELECT genre_id, genre_name FROM Genres WHERE LOWER(genre_name) = $1`,
    [genreName]
  );
  return rows;
}

async function getGamesByGenre(genreId) {
  const { rows } = await pool.query(
    `SELECT game_name, release_date, developer_name 
    FROM Games 
    JOIN Developers 
    ON Games.developer_id = Developers.developer_id 
    WHERE genre_id = $1`,
    [genreId]
  );
  return rows;
}

module.exports = { getAllGenres, getGenreByName, getGamesByGenre };
