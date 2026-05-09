const r = require('express').Router();
const c = require('../controllers/skillController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/error');
const { skillSchema } = require('../validators/schemas');

r.get('/', c.list);
r.get('/:id', c.get);
r.post('/', auth, validate(skillSchema), c.create);
r.put('/:id', auth, c.update);
r.delete('/:id', auth, c.remove);
module.exports = r;
