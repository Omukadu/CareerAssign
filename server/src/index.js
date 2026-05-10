require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');
const decryptJson = require('./middleware/decryptJson');
const encryptJson = require('./middleware/encryptJson');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(decryptJson);
app.use(encryptJson);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/saved', require('./routes/saved'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on :${PORT}`));
});
