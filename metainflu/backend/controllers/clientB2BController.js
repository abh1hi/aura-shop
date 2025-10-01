
// File: backend/controllers/clientB2BController.js
const getB2BClientProfile = (req, res) => {
  res.status(200).json({ message: 'B2B client profile data' });
};
module.exports = {
  getB2BClientProfile,
};

