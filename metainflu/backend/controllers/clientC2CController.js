
// File: backend/controllers/clientC2CController.js
const getC2CClientProfile = (req, res) => {
  res.status(200).json({ message: 'C2C client profile data' });
};
module.exports = {
  getC2CClientProfile,
};