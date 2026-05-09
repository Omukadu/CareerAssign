const r = require('express').Router();
const c = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/error');
const { categorySchema } = require('../validators/schemas');

r.get('/', c.list);
r.post('/', auth, validate(categorySchema), c.create);
r.put('/:id', auth, c.update);
r.delete('/:id', auth, c.remove);
module.exports = r;
