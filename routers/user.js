const express = require('express');
const authController = require('../services/auth');
const userController = require('../services/user');

const router = express.Router();


router
    .get("/getAllUsers", userController.getAllUsers)
    .get('/getUserByToken', userController.getTokenAsParameter, userController.getUserByToken)
    .get('/getUserTickets', userController.getTokenAsParameter, userController.getUserTickets)
    .post('/signup', authController.signup)
    .post('/login', authController.login)
    .post("/loginViaReservePassword", authController.loginViaReservePassword)
    .post('/createReservePassword', authController.createReservePassword)
    .patch('/updateUser', userController.getTokenAsParameter, userController.updateUser)
    .post("/createUser", userController.createUser)
    .delete('/deleteUser/:id', userController.getTokenAsParameter, userController.deleteUser)



module.exports = router;