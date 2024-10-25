const db = require("../db/queries");

async function getGames(req, res) {
  console.log(req.params);
  const genreName = req.params.genre_name.toLowerCase();
  console.log(genreName);
  if (genreName !== "all") {
    const genreResult = await db.getGenreByName(genreName);
    const genreId = genreResult[0].genre_id;
    const games = await db.getGamesByGenre(genreId);
    res.render("genres", { games: games, params: req.params });
  } else if (genreName === "all") {
    const games = await db.getAllGames();
    res.render("genres", { games: games, params: req.params });
  }
}

async function getGenres(req, res) {
  const genres = await db.getAllGenres();
  res.render("add", { genres: genres, params: req.params });
}

module.exports = { getGames, getGenres };
