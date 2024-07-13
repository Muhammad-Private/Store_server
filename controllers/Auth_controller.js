const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User_schema');
const { mailOptions, transporter } = require('../mail/Mailconfig');

dotenv.config();

const generateRandomCode = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const hashPassword = async (plainTextPassword) => {
  const saltRounds = 10;
  return bcrypt.hash(plainTextPassword, saltRounds);
};

const sendEmailCode = (email, randomCode) => {
  const MailOptions = {
    ...mailOptions,
    to: email,
    text: `Your verification code is: ${randomCode}`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(MailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const Register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(422).json({ message: 'Username or Email already exists' });
    }
    if (password !== confirmPassword) {
      return res.status(422).json({ message: 'Passwords do not match' });
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      return res.status(422).json({ message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const access_token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_KEY, { expiresIn: '15' });
    const refresh_token = jwt.sign({ userId: newUser._id }, process.env.REFRESH_KEY, { expiresIn: '1d' });
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    }).status(201).json({ message: "User created successfully 😊 👌", access_token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const randomCode = generateRandomCode();
    await sendEmailCode(email, randomCode);
    res.status(201).json({ randomCode, message: "Code has been sent to email", email });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ message: 'Passwords do not match' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return res.status(422).json({ message: 'The password must not be the previous one.' });
    }

    const hashedPassword = await hashPassword(password);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });
    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating password' });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true, secure: true }).status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = { Register, Login, ForgotPassword, updatePassword, Logout };
