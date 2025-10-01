

// File: backend/utils/roleCheck.js

// This file contains a utility function to check user roles.
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: `Not authorized as a ${role}` });
    }
  };
};

module.exports = {
  checkRole,
};
