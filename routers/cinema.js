const express = require('express');
const cinemaController = require('../services/cinema');
const sessionController = require("../services/session");

const router = express.Router();

router
    .get("/getAllCinemas", cinemaController.getAllCinemas)
    .post("/createCinema", cinemaController.createCinema)
    .patch("/updateCinema/:id", cinemaController.updateCinema)
    .delete("/deleteCinema", cinemaController.deleteCinema)
    .get("/getCinema/:id", cinemaController.getCinema);

module.exports = router;