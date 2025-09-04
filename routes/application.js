const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Multer setup for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// ------------------ ROUTES ------------------

// Create new application
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { firstName, lastName, age, degree, experience, email, project } = req.body;

    if (!firstName || !lastName || !age || !email || !project) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }
    if (!req.file) return res.status(400).json({ msg: "Resume file is required" });

    const newApp = new Application({
      firstName,
      lastName,
      age,
      degree: degree || "",
      experience: experience || "",
      email,
      project,
      resume: req.file.filename,
      status: "pending",
    });

    await newApp.save();
    res.status(201).json({ msg: "Application submitted successfully!", application: newApp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error creating application" });
  }
});

// Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error fetching applications" });
  }
});

// Update an application (Edit) with optional file
router.put("/:id", upload.single("resume"), async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    const { firstName, lastName, age, degree, experience, email, project } = req.body;
    if (firstName) app.firstName = firstName;
    if (lastName) app.lastName = lastName;
    if (age) app.age = age;
    if (degree !== undefined) app.degree = degree;
    if (experience !== undefined) app.experience = experience;
    if (email) app.email = email;
    if (project) app.project = project;

    if (req.file) {
      if (app.resume) {
        const oldPath = path.join(__dirname, "../uploads", app.resume);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      app.resume = req.file.filename;
    }

    await app.save();
    res.status(200).json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error updating application" });
  }
});

// Delete application
router.delete("/:id", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    if (app.resume) {
      const filePath = path.join(__dirname, "../uploads", app.resume);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Application deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error deleting application" });
  }
});

// Accept application -> send email
router.put("/:id/accept", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    app.status = "accepted";
    await app.save();

    await transporter.sendMail({
      from: `"Lifewood Team" <${process.env.EMAIL_USER}>`,
      to: app.email,
      subject: "🎉 Your Application is Accepted!",
      html: `
      <div style="font-family: 'Manrope', sans-serif; background-color:#f5f7f6; padding:30px;">
        <div style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          <div style="background-color:#046241; padding:20px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:24px;">Lifewood Team</h1>
          </div>
          <div style="padding:30px; color:#222222;">
            <h2 style="color:#028a63;">Congratulations, ${app.firstName}!</h2>
            <p>Your application for <strong>${app.project}</strong> has been <strong>accepted</strong>.</p>
            <p>We are excited to have you on board and will contact you with the next steps soon.</p>
            <p style="margin-top:20px;">Keep up the great work!</p>
          </div>
          <div style="background-color:#e6f0ed; padding:20px; text-align:center; font-size:14px; color:#555555;">
            <p>Best regards,</p>
            <p><strong>Lifewood Team</strong></p>
            <p style="margin-top:10px;"><a href="https://lifewood-web-ph.onrender.com" style="color:#046241; text-decoration:none;">Visit our website</a></p>
          </div>
        </div>
      </div>
      `,
    });

    res.json({ msg: "Application accepted and email sent", application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error accepting application" });
  }
});

// Decline application -> send email
router.put("/:id/decline", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    app.status = "declined";
    await app.save();

    await transporter.sendMail({
      from: `"Lifewood Team" <${process.env.EMAIL_USER}>`,
      to: app.email,
      subject: "Application Update from Lifewood",
      html: `
      <div style="font-family: 'Manrope', sans-serif; background-color:#f5f7f6; padding:30px;">
        <div style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          <div style="background-color:#046241; padding:20px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:24px;">Lifewood Team</h1>
          </div>
          <div style="padding:30px; color:#222222;">
            <h2 style="color:#028a63;">Hello ${app.firstName},</h2>
            <p>We regret to inform you that your application for <strong>${app.project}</strong> was not accepted.</p>
            <p>We appreciate your interest in our Lifewood Training Program and encourage you to apply for future opportunities.</p>
          </div>
          <div style="background-color:#e6f0ed; padding:20px; text-align:center; font-size:14px; color:#555555;">
            <p>Best regards,</p>
            <p><strong>Lifewood Team</strong></p>
            <p style="margin-top:10px;"><a href="https://lifewood-web-ph.onrender.com" style="color:#046241; text-decoration:none;">Visit our website</a></p>
          </div>
        </div>
      </div>
      `,
    });

    res.json({ msg: "Application declined and email sent", application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error declining application" });
  }
});

module.exports = router;
