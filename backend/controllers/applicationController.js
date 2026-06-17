const Application = require("../models/Application");

// APPLY TO PROJECT (freelancer)
exports.applyToProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const freelancerId = req.user.userId; // from auth middleware

    // check if already applied
    const existing = await Application.findOne({
      projectId,
      freelancerId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = new Application({
      projectId,
      freelancerId,
    });

    await application.save();

    res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MY APPLICATIONS (freelancer)
exports.getMyApplications = async (req, res) => {
  try {
    const freelancerId = req.user.userId;

    const applications = await Application.find({ freelancerId })
      .populate("projectId")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    console.log("GET MY APPLICATIONS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET APPLICATIONS FOR A PROJECT (client)
exports.getProjectApplications = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const applications = await Application.find({ projectId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STATUS (client)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: "Status updated",
      application,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};