import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  class_level: {
    type: Number,
    required: true,   
  },

  subject: {
    type: String,
    required: true,   
  },

  description: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  duration: {
    type: String,     // 6 months, 1 year
  },

  teacher_name: {
    type: String
  },

  thumbnail_url: {
    type: String      // image URL
  },

  video_url: {
    type: String      // video URL for preview
  },

  syllabus: {
    type: [String]    // array of topics
  },

  features: {
    type: [String]    // array of course features
  },



}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
