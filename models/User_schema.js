const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
      },
      message: props => `${props.value} 'Password must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long'`,
    },
  },
});




// Add a method to the schema for password validation
UserSchema.methods.validatePassword = function (password) {
  const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  if (!passwordValidation) 
    {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long',
    };
  }
  return { isValid: true };
};







// Pre-save hook to validate and hash password
UserSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  const { isValid, message } = user.validatePassword(user.password);
  if (!isValid) {
    const validationError = new mongoose.Error.ValidationError(user);
    validationError.errors.password = new mongoose.Error.ValidatorError({
      path: 'password',
      message,
    });
    return next(validationError);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.confirmPassword = undefined;  // Clear the confirmPassword field after validation and before saving
  next();
});

module.exports = mongoose.model('User', UserSchema);
