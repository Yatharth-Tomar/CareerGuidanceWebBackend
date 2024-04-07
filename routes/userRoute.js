const express = require('express');
const { isLoggedIn } = require('../middleware/jwtAuth');
const router = express.Router();
const upload = require('../middleware/multer.middleware');
const {
  home,
  register,
  login,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
  addUserSkillsById,
  getSkillsByID
} = require('../controller/userControl');

router.get('/home', home);
router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn, getProfile);
router.get('/get-skills/:id',getSkillsByID);
router.post('/reset', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword); //these are endpoints
router.post('/change-password', isLoggedIn, changePassword);
router.post("/add-skills/:id",addUserSkillsById)
router.put('/update/:id', isLoggedIn, upload.single('avatar'), updateUser);
module.exports = router;





