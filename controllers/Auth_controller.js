const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User_schema');
const { generateRandomCode, sendEmailCode } = require('../servies/user.servies');

dotenv.config();



const Register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: 'Username or Email already exists' });
    }

    const newUser = new User({ username, email, password, confirmPassword });
    await newUser.save();

    const access_token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_KEY, { expiresIn: '15m' });
    const refresh_token = jwt.sign({ userId: newUser._id }, process.env.REFRESH_KEY, { expiresIn: '1d' });

    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }).status(201).json({ message: "User created successfully 😊 👌", access_token });
  } 
  catch (error) {
    if (error.name === 'ValidationError') {
      // Send validation error messages to the client
      return res.status(422).json({ message: error.errors.confirmPassword.message });
    }
    res.status(500).json({ message: error.message });
  }
};



const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) 
      {
      return res.status(404).json({ message: 'User not found' });
    }
    const match = await bcrypt.compare(password, existingUser.password);
    
    if (!match) {
      return res.status(401).json({ message: 'Invalid Password' });
    }

    const access_token = jwt.sign({ userId: existingUser._id }, process.env.ACCESS_KEY, { expiresIn: '15m' });
    const refresh_token = jwt.sign({ userId: existingUser._id }, process.env.REFRESH_KEY, { expiresIn: '1d' });

    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    }).status(200).json({ message: "Login successful 😊 👌", access_token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const randomCode = generateRandomCode();
    await sendEmailCode(email, randomCode);

    await User.updateOne({ email }, { $set: { randomCode } });

    res.status(201).json({ message: "Code has been sent to email" });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { isValid, message } = existingUser.validatePassword(password, confirmPassword);
    if (!isValid) {
      return res.status(422).json({ message });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.updateOne({ email }, { $set: { password: hashedPassword, confirmPassword: undefined } });

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating password' });
  }
};

const Logout = (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true, secure: true }).status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = { Register, Login, ForgotPassword, updatePassword, Logout };
