const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const auth = require('../middlewares/auth');

const User = require('../models/users'); // Adjust the path as necessary


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/register-education', auth, authController.registerEducation);
router.post('/register-country', auth, authController.registerCountry);
router.get('/search', auth, authController.searchUsers);


module.exports = router;


router.get('/current-user', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  module.exports = router;