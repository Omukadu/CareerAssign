const r = require('express').Router();
const c = require('../controllers/careerController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/error');
const { careerSchema } = require('../validators/schemas');

r.get('/', c.list);
r.get('/:id', c.get);
r.post('/', auth, validate(careerSchema), c.create);
r.put('/:id', auth, c.update);
r.delete('/:id', auth, c.remove);
module.exports = r;
