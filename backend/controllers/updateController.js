const Update = require("../models/Update");
const Project = require("../models/Project");
const Application = require("../models/Application");

const isAuthorized = async (projectId, userId, role) => {
  if (role === "client") {
    const project = await Project.findOne({ _id: projectId, clientId: userId });
    return !!project;
  }
  if (role === "freelancer") {
    const application = await Application.findOne({
      projectId,
      freelancerId: userId,
      status: "accepted",
    });
    return !!application;
  }
  return false;
};

const getUpdates = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.user;

    const allowed = await isAuthorized(projectId, userId, role);
    if (!allowed) return res.status(403).json({ message: "Access denied." });

    const updates = await Update.find({ projectId })
      .populate("userId", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(updates);
  } catch (error) {
    console.log("getUpdates error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const postUpdate = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.user;
    const { message } = req.body;

    if (!message || !message.trim())
      return res.status(400).json({ message: "Message cannot be empty." });

    const allowed = await isAuthorized(projectId, userId, role);
    if (!allowed) return res.status(403).json({ message: "Access denied." });

    const update = await Update.create({ projectId, userId, message: message.trim() });
    const populated = await update.populate("userId", "name role");

    res.status(201).json(populated);
  } catch (error) {
    console.log("postUpdate error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getUpdates, postUpdate };