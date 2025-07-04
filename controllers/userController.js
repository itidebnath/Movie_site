const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }



  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log("Trying to login with:", email, password);
  console.log("DB password:", user?.password);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }

});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
// @desc Get all users (Admin only)
// @route GET /api/users/
// @access Private/Admin
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc Delete a user by ID (Admin only)
// @route DELETE /api/users/:id
// @access Private/Admin
// controllers/userController.js
const deleteUser = asyncHandler(async (req, res) => {
  console.log("Delete requested for:", req.params.id);

  try {
    const result = await User.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      console.log("User deleted successfully.");
      res.json({ message: 'User removed' });
    } else {
      console.log("User not found.");
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});



// @desc    Send password reset link
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('No user found with that email');
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Save token and expiry to user
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  // Normally, you'd send this via email
  res.json({
    message: 'Password reset token generated',
    token: resetToken,
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password has been reset successfully' });
});


module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUser
};
