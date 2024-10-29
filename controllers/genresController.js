const db = require("../db/queries");
const { validationResult, check } = require("express-validator");

const validateGame = [
  check("title").notEmpty().withMessage("Game title can not be empty."),
  check("developer").notEmpty().withMessage("Developer can not be empty."),
];

async function getGames(req, res) {
  const genreName = req.params.genre_name.toLowerCase();
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

const addGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("add", {
        errors: errors.array(),
        params: req.params,
      });
    }

    if (req.params.genre_name === "all") {
      await db.addNewGame(
        req.body.title,
        req.body.genre,
        req.body.developer,
        req.body.date
      );
    } else {
      await db.addNewGame(
        req.body.title,
        req.params.genre_name,
        req.body.developer,
        req.body.date
      );
    }
    res.redirect(`/genres/${req.params.genre_name}`);
  },
];

async function deleteGame(req, res) {
  const gameName = req.params.game_name;
  await db.deleteGameByName(gameName);
  res.status(200);
  res.end();
}

module.exports = { getGames, getGenres, addGame, deleteGame };
