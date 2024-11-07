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

    const genreName =
      req.params.genre_name === "all" ? req.body.genre : req.params.genre_name;

    const gameId = await db.addNewGame(
      req.body.title,
      genreName,
      req.body.developer,
      req.body.date
    );
    const errorArray = [];
    if (!gameId) {
      errorArray.push({ msg: "This game already exists in the database." });
      return res.status(400).render("add", {
        errors: errorArray,
        params: req.params,
      });
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

async function getGameAndGenres(req, res) {
  const gameId = req.query.id;
  const genres = await db.getAllGenres();
  const game = await db.getGameById(gameId);
  game.release_date = convertDate(game.release_date);
  res.render("edit", {
    game: game,
    params: req.params,
    genres: genres,
    query: req.query,
  });
}

function convertDate(yourDate) {
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
  return yourDate.toISOString().split("T")[0];
}

const editGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("edit", {
        errors: errors.array(),
        params: req.params,
        query: req.query,
      });
    }
    console.log(req.body);
    console.log(req.query);
    const updatedGame = {
      newGameName: req.body.title,
      genreName: req.body.genre,
      developerName: req.body.developer,
      releaseDate: req.body.date,
    };
    const result = await db.editGameById(req.query.id, updatedGame);
    if (!result) {
      return res.status(400).render("edit", {
        errors: [{ msg: "This game already exists in the database." }],
        params: req.params,
        query: req.query,
      });
    }

    res.redirect(`/genres/${req.params.genre_name}`);
  },
];

module.exports = {
  getGames,
  getGenres,
  addGame,
  deleteGame,
  getGameAndGenres,
  editGame,
};
