const r = require('express').Router();
const c = require('../controllers/savedController');
const auth = require('../middleware/auth');

r.use(auth);
r.get('/', c.list);
r.post('/:careerId', c.save);
r.delete('/:careerId', c.unsave);
module.exports = r;
