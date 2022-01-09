const router = require('express').Router();

const Tides = require('../controllers/tides');

router.get('/today', Tides.findTodayTide);

module.exports = router;
