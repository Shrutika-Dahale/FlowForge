
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createProject, getAllProjects, updateProject, deleteProject, getProjectById, } = require("../controllers/projectController");
const { getAllProjectsForFreelancer } = require("../controllers/projectController");
router.post("/createProject", authMiddleware, createProject);
router.get("/projects", authMiddleware, getAllProjects);
router.get("/all", authMiddleware, getAllProjectsForFreelancer);
router.get("/:id", authMiddleware, getProjectById);
router.put("/updateProject/:id", authMiddleware, updateProject);
router.delete("/deleteProject/:id", authMiddleware, deleteProject);
module.exports = router;