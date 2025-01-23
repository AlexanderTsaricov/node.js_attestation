const express = require("express");
const path = require("path");
const fs = require("fs");
const joi = require("joi");
const handlebars = require("handlebars");
const app = express();
const port = 3000;

const templatePath = path.join(__dirname, "HTML/templates/users.handlebars");

app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "HTML")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post("/submit", (req, res) => {
    const userIn = req.body;
    console.log("input user:\n" + userIn);
    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500);
            res.send(err.message);
        } else {
            const users = JSON.parse(data);
            const hasName = users.some(
                (user) => user.username === userIn.username
            );
            if (!hasName) {
                users.push(userIn);
                fs.writeFile(
                    "users.json",
                    JSON.stringify(users, null, 2),
                    "utf-8",
                    (writeErr) => {
                        if (writeErr) {
                            return res.status(500);
                        }

                        res.status(200);
                        res.redirect("/");
                    }
                );
            } else {
                return res.status(400).send({
                    error: "This user already exists",
                });
            }
        }
    });
});

app.listen(port, () => {
    console.log("Server start");
});
