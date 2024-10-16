const { Router } = require("express");
const genresController = require("../controllers/genresController");
const genresRouter = Router();

genresRouter.get("/:genre_name", genresController.getGames);

module.exports = genresRouter;
