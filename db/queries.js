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
    `SELECT game_name, game_id, release_date, developer_name, genre_name
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
    `SELECT game_name, game_id, release_date, developer_name, genre_name
    FROM games 
    JOIN developers 
    ON games.developer_id = developers.developer_id 
    JOIN genres ON games.genre_id = genres.genre_id`
  );
  return rows;
}

async function addNewGame(gameName, genreName, developerName, releaseDate) {
  const existingGameResult = await pool.query(
    `SELECT game_id FROM games WHERE LOWER(game_name) = $1 AND release_date = $2`,
    [gameName.toLowerCase(), releaseDate]
  );

  if (existingGameResult.rows.length > 0) {
    return existingGameResult.rows[0].game_id;
  }

  const genreResult = await pool.query(
    `SELECT genre_id FROM genres WHERE LOWER(genre_name) = $1`,
    [genreName.toLowerCase()]
  );

  const genreId = genreResult.rows[0].genre_id;

  let developerResult = await pool.query(
    `SELECT developer_id FROM developers WHERE developer_name = $1`,
    [developerName]
  );

  let developerId;
  if (developerResult.rows.length > 0) {
    developerId = developerResult.rows[0].developer_id;
  } else {
    developerResult = await pool.query(
      `INSERT INTO developers (developer_name) VALUES ($1)
       RETURNING developer_id`,
      [developerName]
    );
    developerId = developerResult.rows[0].developer_id;
  }

  const { rows } = await pool.query(
    `INSERT INTO games (game_name, genre_id, developer_id, release_date)
     VALUES ($1, $2, $3, $4)
     RETURNING game_id`,
    [gameName, genreId, developerId, releaseDate]
  );

  return rows[0].game_id;
}

async function getGameById(gameId) {
  const { rows } = await pool.query(
    `SELECT 
        games.game_name,
        genres.genre_name,
        developers.developer_name,
        games.release_date
    FROM 
        games
    JOIN 
        genres ON games.genre_id = genres.genre_id
    JOIN 
        developers ON games.developer_id = developers.developer_id
    WHERE 
        games.game_id = $1;`,
    [gameId]
  );
  return rows[0];
}

async function deleteGameByName(gameName) {
  await pool.query("DELETE FROM games WHERE game_name = $1", [gameName]);

  await pool.query(`
    DELETE FROM developers 
    WHERE developer_id NOT IN (SELECT developer_id FROM games);
  `);
}

async function editGameById(currentGameId, updatedDetails) {
  const { newGameName, genreName, developerName, releaseDate } = updatedDetails;

  const currentDeveloperResult = await pool.query(
    `SELECT developer_id FROM games WHERE game_id = $1`,
    [currentGameId]
  );
  const oldDeveloperId = currentDeveloperResult.rows[0]?.developer_id;

  const developerResult = await pool.query(
    `SELECT developer_id FROM developers WHERE LOWER(developer_name) = LOWER($1)`,
    [developerName]
  );

  let developerId;
  if (developerResult.rows.length > 0) {
    developerId = developerResult.rows[0].developer_id;
  } else {
    const insertDeveloperResult = await pool.query(
      `INSERT INTO developers (developer_name) 
       VALUES ($1)
       RETURNING developer_id;`,
      [developerName]
    );
    developerId = insertDeveloperResult.rows[0].developer_id;
  }

  const updateResult = await pool.query(
    `UPDATE games
    SET 
        game_name = $1,
        genre_id = (SELECT genre_id FROM genres WHERE genre_name = $2),
        developer_id = $3,
        release_date = $4
    WHERE game_id = $5
    RETURNING *;`,
    [newGameName, genreName, developerId, releaseDate, currentGameId]
  );

  if (oldDeveloperId && oldDeveloperId !== developerId) {
    const oldDeveloperGamesResult = await pool.query(
      `SELECT 1 FROM games WHERE developer_id = $1 LIMIT 1`,
      [oldDeveloperId]
    );

    if (oldDeveloperGamesResult.rows.length === 0) {
      await pool.query(`DELETE FROM developers WHERE developer_id = $1`, [
        oldDeveloperId,
      ]);
    }
  }

  return updateResult.rows[0];
}

module.exports = {
  getAllGenres,
  getGenreByName,
  getGamesByGenre,
  getAllGames,
  addNewGame,
  deleteGameByName,
  editGameById,
  getGameById,
};
