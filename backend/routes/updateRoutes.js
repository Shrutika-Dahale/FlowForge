const express = require("express");
const router = express.Router();
const { getUpdates, postUpdate } = require("../controllers/updateController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:projectId", authMiddleware, getUpdates);
router.post("/:projectId", authMiddleware, postUpdate);

module.exports = router;