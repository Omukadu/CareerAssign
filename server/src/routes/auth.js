const r = require('express').Router();
const c = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validate } = require('../middleware/error');
const { registerSchema, loginSchema } = require('../validators/schemas');

r.post('/register', validate(registerSchema), c.register);
r.post('/login', validate(loginSchema), c.login);
r.get('/me', auth, c.me);
module.exports = r;
