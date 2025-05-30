const express = require('express');
const sessionController = require('../services/session');
const movieController = require("../services/movie");

const router = express.Router();

router
    .get("/getSession/:id", sessionController.getSession)
    .get("/getAllSessions", sessionController.getAllSessions)
    .post("/deleteSession", sessionController.deleteSession)
    .post("/createSession", sessionController.createSession)
    .patch("/updateSession/:id", sessionController.updateSession);
    
module.exports = router;