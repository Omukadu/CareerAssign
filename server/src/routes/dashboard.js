const r = require('express').Router();
const c = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

r.get('/', auth, c.summary);
module.exports = r;
