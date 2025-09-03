const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  degree: { type: String },
  experience: { type: String },
  email: { type: String, required: true },
  project: { type: String, required: true },
  resume: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
