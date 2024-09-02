"use server"
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String, // Single string for each userId
    required: true,
  },
  Type: {
    type: [String], // Array of strings for types
    default: [],
  },
  Message: {
    type: [String], // Array of strings for messages
    default: [],
  },
});

const reportSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  users: [userSchema], // Embedded user schema
});

const Model = mongoose.models.report || mongoose.model('report', reportSchema);

export default Model;
