const mongoose = require("mongoose");
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
            message: props => `${props.value} 'Password must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long'`
        }
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
            },
            message: props => `${props.value} 'Confirm Password must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long'`
        }
    },
});

UserSchema.pre('save', async function (next) {
   
    const user = this;

    if (!user.isModified('password')) 
        {
        return next();
    }

    // Validate password before hashing
    const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(user.password);
    if (!passwordValidation)
         {
        const validationError = new mongoose.Error.ValidationError(user);
        validationError.errors.password = new mongoose.Error.ValidatorError({
            path: 'password',
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long'
        });
        return next(validationError);
    }

    // Check if passwords match
    if (user.password !== user.confirmPassword) 
        {
        const validationError = new mongoose.Error.ValidationError(user);
        validationError.errors.confirmPassword = new mongoose.Error.ValidatorError({
            path: 'confirmPassword',
            message: 'Passwords do not match'
        });
        return next(validationError);
    }

    const hashedPassword=async()=>
        {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.confirmPassword = undefined; 
        }

    next();
});

module.exports = mongoose.model("User", UserSchema);
