const express = require("express");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const app = express();
const port = 3000;

const templatePath = path.join(__dirname, "HTML/templates/users.handlebars");

app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "HTML")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "HTML/index.html"));
});

app.get("/users", (req, res) => {
    fs.readFile(templatePath, "utf-8", (templateErr, templateData) => {
        if (templateErr) {
            res.status(500).send("Template error");
            return;
        }
        fs.readFile("users.json", "utf-8", (err, data) => {
            if (err) {
                res.status(500);
                res.send(err.message);
            } else {
                const template = handlebars.compile(templateData);
                const users = JSON.parse(data);
                const html = template({ users });
                res.send(html);
            }
        });
    });
});

app.listen(port, () => {
    console.log("Server start");
});
