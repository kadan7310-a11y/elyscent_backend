function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body.' });
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join('. ');
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID or value.' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'That value is already in use.' });
  }

  console.error(err);
  return res.status(500).json({ message: 'Something went wrong on the server.' });
}

module.exports = errorHandler;
