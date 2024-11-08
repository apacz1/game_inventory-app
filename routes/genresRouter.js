const { Router } = require("express");
const genresController = require("../controllers/genresController");
const genresRouter = Router();

genresRouter.get("/:genre_name", genresController.getGames);
genresRouter.get("/:genre_name/add", genresController.getGenres);
genresRouter.post("/:genre_name/add", genresController.addGame);
genresRouter.delete("/:genre_name/:game_name", genresController.deleteGame);
genresRouter.get("/:genre_name/edit", genresController.getGameAndGenres);
genresRouter.post("/:genre_name/edit", genresController.editGame);

module.exports = genresRouter;
