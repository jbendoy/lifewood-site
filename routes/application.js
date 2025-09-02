const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const nodemailer = require("nodemailer");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create new application (Add User) + auto-accept + send email
router.post("/", async (req, res) => {
  try {
    // Create new application with status 'accepted' if admin adds user
    const newApp = new Application({ ...req.body, status: "accepted" });
    await newApp.save();

    // Send acceptance email
    await transporter.sendMail({
      from: `"Lifewood Team" <${process.env.EMAIL_USER}>`,
      to: newApp.email,
      subject: "🎉 Welcome to Lifewood Training Program!",
      html: `<h1>Congratulations, ${newApp.firstName}!</h1>
             <p>Your account for <strong>${newApp.project}</strong> has been successfully created and accepted.</p>
             <p>We’ll contact you with next steps soon.</p>
             <br/><p>Best regards,</p><p><strong>Lifewood Team</strong></p>`,
    });

    res.status(201).json({ msg: "User added, accepted, and email sent!", application: newApp });
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

// Update an application (Edit)
router.put("/:id", async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedApp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error updating application" });
  }
});

// Delete application
router.delete("/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Application deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error deleting application" });
  }
});

// Accept application + send email
router.put("/:id/accept", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    app.status = "accepted";
    await app.save();

    await transporter.sendMail({
      from: `"Lifewood Team" <${process.env.EMAIL_USER}>`,
      to: app.email,
      subject: "🎉 Application Accepted!",
      html: `<h1>Congratulations, ${app.firstName}!</h1>
             <p>Your application for <strong>${app.project}</strong> has been accepted.</p>
             <p>We’ll contact you with next steps soon.</p>
             <br/><p>Best regards,</p><p><strong>Lifewood Team</strong></p>`,
    });

    res.json({ msg: "Application accepted and email sent", application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error accepting application" });
  }
});

// Decline application + optional email
router.put("/:id/decline", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ msg: "Application not found" });

    app.status = "declined";
    await app.save();

    await transporter.sendMail({
      from: `"Lifewood Team" <${process.env.EMAIL_USER}>`,
      to: app.email,
      subject: "Application Update",
      html: `<h1>Hi ${app.firstName},</h1>
             <p>We regret to inform you that your application for <strong>${app.project}</strong> was not accepted.</p>
             <p>Thank you for your interest in Lifewood Training Program!</p>
             <br/><p>Best regards,</p><p><strong>Lifewood Team</strong></p>`,
    });

    res.json({ msg: "Application declined and email sent", application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error declining application" });
  }
});

module.exports = router;
