// controllers/profileController.js
const User = require('../models/users');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, phonenumber, bio, level, city, image } = req.body;

    // Find user by id
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (phonenumber) user.phonenumber = phonenumber;
    if (bio) user.bio = bio;
    if (level) user.level = level;
    if (city) user.city = city;
    if (image) user.image = image;

    await user.save();

    // Remove password from response
    user = user.toObject();
    delete user.password;

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};