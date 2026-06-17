const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const updateRoutes = require("./routes/updateRoutes");
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/application", require("./routes/applicationRoutes"));

app.use("/api/updates", updateRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB connection
//console.log("MONGO URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log("DB ERROR:");
    console.log(err);
  });

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});