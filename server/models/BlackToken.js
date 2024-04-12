import mongoose from "mongoose";

const Schema = mongoose.Schema

// Define the blacklisted token schema
const BlackTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7, // expire in 1 week
  },
});

// Define the blacklisted token model
const BlackToken = mongoose.model('BlackToken', BlackTokenSchema);

export default BlackToken;
