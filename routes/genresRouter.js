const { Router } = require("express");
const genresController = require("../controllers/genresController");
const genresRouter = Router();

genresRouter.get("/:genre_name", genresController.getGames);
genresRouter.get("/:genre_name/add", genresController.getGenres);
genresRouter.get("/:genre_name/edit");

module.exports = genresRouter;
