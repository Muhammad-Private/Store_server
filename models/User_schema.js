const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true ,
      validate: {
        validator: function(v) {
            return /^[a-zA-Z0-9_]+$/.test(v);
        },
        message: props => `${props.value} 'Username must contain only letters, numbers, and underscores'`
    }
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        // Regular expression for email validation
        validate: {
            validator: function(v) 
            {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: { 
        type: String,  
        required: true,
        // Custom validation for password
    }
});

module.exports = mongoose.model("User", UserSchema);
