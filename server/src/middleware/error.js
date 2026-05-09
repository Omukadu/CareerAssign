const { ZodError } = require('zod');

exports.notFound = (req, res) => res.status(404).json({ message: 'Not found' });

exports.errorHandler = (err, req, res, _next) => {
  console.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value', fields: err.keyValue });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};

exports.validate = (schema) => (req, _res, next) => {
  schema.parse(req.body);
  next();
};
