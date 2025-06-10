import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 5,
    maxLength: 255,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
