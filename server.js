const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const shortid = require("shortid");

const Student = require("./models/Student");
const Url = require("./models/Url");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Home route
app.get("/", async (req, res) => {
    const students = await Student.find();

    const data = students.map(s => ({
        name: s.name,
        marks: s.marks,
        result: s.marks >= 50 ? "Pass" : "Fail"
    }));

    res.render("index", { students: data });
});

// Insert data
app.get("/add-data", async (req, res) => {
    await Student.insertMany([
        { name: "Aman", marks: 80 },
        { name: "Riya", marks: 45 },
        { name: "John", marks: 60 }
    ]);

    res.send("Data inserted");
});

// URL Shortener
app.post("/shorten", async (req, res) => {
    const shortId = shortid.generate();

    await Url.create({
        originalUrl: req.body.url,
        shortId: shortId
    });

    res.send(`Short URL: http://localhost:3000/${shortId}`);
});

app.get("/:id", async (req, res) => {
    const url = await Url.findOne({ shortId: req.params.id });

    if (url) return res.redirect(url.originalUrl);
    res.send("Not found");
});

app.listen(3000, () => console.log("Server running on port 3000"));