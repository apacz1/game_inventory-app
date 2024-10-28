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

async function addNewGame(gameName, genreName, developerName, releaseDate) {
  const genreResult = await pool.query(
    `SELECT genre_id FROM genres WHERE LOWER(genre_name) = $1`,
    [genreName.toLowerCase()]
  );

  const genreId = genreResult.rows[0].genre_id;

  const developerResult = await pool.query(
    `INSERT INTO developers (developer_name) VALUES ($1)
     ON CONFLICT (developer_name) DO NOTHING
     RETURNING developer_id`,
    [developerName]
  );

  let developerId;
  if (developerResult.rows.length > 0) {
    developerId = developerResult.rows[0].developer_id;
  } else {
    const existingDeveloper = await pool.query(
      `SELECT developer_id FROM developers WHERE developer_name = $1`,
      [developerName]
    );
    developerId = existingDeveloper.rows[0].developer_id;
  }

  const { rows } = await pool.query(
    `INSERT INTO games (game_name, genre_id, developer_id, release_date)
     VALUES ($1, $2, $3, $4)
     RETURNING game_id`,
    [gameName, genreId, developerId, releaseDate]
  );

  return rows[0].game_id;
}

module.exports = {
  getAllGenres,
  getGenreByName,
  getGamesByGenre,
  getAllGames,
  addNewGame,
};
