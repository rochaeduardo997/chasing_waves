const app = require('express')();

const tides = require('./tides');

app.use('/tides', tides);

module.exports = app;
