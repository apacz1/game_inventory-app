const db = require("../db/queries");

async function getGames(req, res) {
  console.log(req.url);
  const genreName = req.params.genre_name.toLowerCase();
  const genreResult = await db.getGenreByName(genreName);
  const genreId = genreResult[0].genre_id;
  const games = await db.getGamesByGenre(genreId);

  res.render("genres", { games: games });
}

module.exports = { getGames };
