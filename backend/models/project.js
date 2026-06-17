const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: Date,
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});
module.exports = mongoose.model("Project", projectSchema);