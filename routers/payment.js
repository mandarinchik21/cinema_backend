const payController = require('../services/pay');
const express = require('express');
const router = express.Router();

router
    .get('/success/:sessionId', payController.checkoutSuccess)
    .get('/cancel/:sessionId', payController.checkoutCancel)
    .get('/tickets/:sessionId', payController.getTicketsBySessionId)
    .post('/buyTicket', payController.buyTicket);


module.exports = router;