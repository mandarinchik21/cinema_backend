const express = require('express');
const movieController = require('../services/movie');

const router = express.Router();

router
    .get("/getAllMovies", movieController.getMovies)
    .get("/getMovie/:id", movieController.getMovie)
    .post("/createMovie", movieController.createMovie)
    .delete("/deleteMovie", movieController.deleteMovie)
    .patch("/updateMovie/:id", movieController.updateMovie);



module.exports = router;