const pool = require("./pools");

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getGenreByName(genreName) {
  const { rows } = await pool.query(
    `SELECT genre_id, genre_name FROM genres WHERE LOWER(genre_name) = $1`,
    [genreName]
  );
  return rows;
}

async function getGamesByGenre(genreId) {
  const { rows } = await pool.query(
    `SELECT game_name, release_date, developer_name, genre_name
    FROM games 
    JOIN developers 
    ON games.developer_id = developers.developer_id 
    JOIN genres ON games.genre_id = genres.genre_id
    WHERE games.genre_id = $1`,
    [genreId]
  );
  return rows;
}

async function getAllGames() {
  const { rows } = await pool.query(
    `SELECT game_name, release_date, developer_name, genre_name
    FROM games 
    JOIN developers 
    ON games.developer_id = developers.developer_id 
    JOIN genres ON games.genre_id = genres.genre_id`
  );
  return rows;
}

module.exports = { getAllGenres, getGenreByName, getGamesByGenre, getAllGames };
