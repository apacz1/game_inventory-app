const db = require("../db/queries");

async function getGenres(req, res) {
  const genres = await db.getAllGenres();
  res.render("index", { genres: genres });
}

module.exports = { getGenres };
