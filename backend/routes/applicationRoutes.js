const express = require("express");
const router = express.Router();

const {
  applyToProject,
  getMyApplications,
  getProjectApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

// Freelancer apply
router.post("/apply/:projectId", authMiddleware, applyToProject);

// Freelancer - my applications
router.get("/my", authMiddleware, getMyApplications);

// Client - view applications for a project
router.get("/project/:projectId", authMiddleware, getProjectApplications);

// Client - accept/reject
router.put("/:id", authMiddleware, updateApplicationStatus);

module.exports = router;