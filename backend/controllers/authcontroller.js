const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



exports.signup = async (req, res) => {
  try {
    const { email, password, username, phonenumber } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email,
      password: hashedPassword,
      username,
      phonenumber,
    });

    await user.save();

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        userName:user.username
      },
    };

    jwt.sign(payload,   process.env.JWT_SECRET , { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, userId: user.id });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        userName:user.username
      },
    };

    jwt.sign(payload,   process.env.JWT_SECRET , { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, userId: user.id });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.registerEducation = async (req, res) => {
  try {
    const { userId, level } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { level },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Education level updated successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.registerCountry = async (req, res) => {
  try {
    const { userId, city } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { city },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'city updated successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

exports.searchUsers = async (req, res) => {
    try {
      const { term } = req.query;
      const users = await User.find({ 
        username: { $regex: term, $options: 'i' } 
      }).select('username image');
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// middleware/auth.js
