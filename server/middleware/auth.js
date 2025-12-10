// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Please log in to access this resource'
    });
  }
}

module.exports = { requireAuth };
