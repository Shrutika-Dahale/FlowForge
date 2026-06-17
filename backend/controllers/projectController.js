const Project = require("../models/Project");
const jwt = require("jsonwebtoken");

exports.createProject = async (req, res) => {
  try {
    const { title, description, deadline, clientId } = req.body;
    const newProject = await Project.create({
      title,
      description,
      deadline,
      clientId: req.user.userId,
    });
    res.status(201).json({
      message: "Project Created successfully",
      project: newProject,
    });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      clientId: req.user.userId,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.clientId) {
      return res.status(400).json({ message: "Project has no owner" });
    }

    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Project updated",
      project: updatedProject,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    console.log("PROJECT:", project);
    console.log("USER:", req.user);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.clientId) {
      return res.status(400).json({ message: "Project has no owner" });
    }

    if (project.clientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Project.findByIdAndDelete(id);

    res.json({ message: "Project deleted" });

  } catch (error) {
    console.log("DELETE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
exports.getAllProjectsForFreelancer = async (req, res) => {
  try {
    console.log("INSIDE getAllProjectsForFreelancer");

    const projects = await Project.find();

    console.log("PROJECTS FOUND:", projects);

    res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (err) {
    console.log("ERROR OCCURRED:");
    console.log(err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "clientId",
      "name email"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
