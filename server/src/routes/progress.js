const r = require('express').Router();
const c = require('../controllers/progressController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/error');
const { progressSchema } = require('../validators/schemas');

r.use(auth);
r.get('/', c.list);
r.put('/:skillId', validate(progressSchema), c.upsert);
r.delete('/:skillId', c.remove);
module.exports = r;
