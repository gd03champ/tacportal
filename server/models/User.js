import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  rollno: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: 'Invalid email format'
    }
  },
  role: {
      type: String,
      required: true,
      enum: ['student', 'staff']
  }, 
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  department: {
    type: String,
    required: false,
    enum: ["cse", "ece", "eee", "mech", "auto", "it"],
  },
}, {
  timestamps: true // Add createdAt and updatedAt timestamps automatically
});

const User = mongoose.model('User', userSchema);
export default User;
