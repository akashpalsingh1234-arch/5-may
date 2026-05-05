const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    marks: Number
});

module.exports = mongoose.model("Student", studentSchema);