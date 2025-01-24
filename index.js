const express = require("express");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const app = express();
const port = 3000;
const usernameSchema = require("./schems/username");
const telephoneSchema = require("./schems/telephone");
const { checkBody } = require("./validationFunc/check");

const templatePath = path.join(__dirname, "HTML/templates/users.handlebars");
const templatePathChageUser = path.join(__dirname, "HTML/templates/changeUser.handlebars");

app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "HTML")));
app.use("/js", express.static(path.join(__dirname, "HTML/templates/js")));
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

app.get("/users/:username", (req, res) => {
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
                const hasName = users.some((user) => user.username === req.params.username);
                if (hasName) {
                    const userIndex = users.findIndex((user) => user.username === req.params.username);
                    if (userIndex !== -1) {
                        const needUser = [users[userIndex]];
                        console.log(needUser);
                        const html = template({ users: needUser });
                        res.send(html);
                    }
                } else {
                    return res.status(404).send({
                        error: "This user not found",
                    });
                }
            }
        });
    });
});

app.get("/users/:username/changeUser", (req, res) => {
    fs.readFile(templatePathChageUser, "utf-8", (templateErr, templateData) => {
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
                const hasName = users.some((user) => user.username === req.params.username);
                if (hasName) {
                    const userIndex = users.findIndex((user) => user.username === req.params.username);
                    if (userIndex !== -1) {
                        const needUser = users[userIndex];
                        console.log(needUser);
                        const html = template(needUser);
                        res.send(html);
                    }
                } else {
                    return res.status(404).send({
                        error: "This user not found",
                    });
                }
            }
        });
    });
});

app.post("/submit", checkBody(usernameSchema, telephoneSchema), (req, res) => {
    const userIn = req.body;
    console.log(userIn);
    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500);
            res.send(err.message);
        } else {
            const users = JSON.parse(data);
            const hasName = users.some((user) => user.username === userIn.username);
            if (!hasName) {
                users.push(userIn);
                const newSaveUsers = JSON.stringify(users);
                fs.writeFile("users.json", newSaveUsers, "utf-8", (writeErr) => {
                    if (writeErr) {
                        return res.status(500);
                    }

                    res.status(200);
                    res.redirect("/users");
                });
                console.log("Add user complite");
            } else {
                return res.status(400).send({
                    error: "This user already exists",
                });
            }
        }
    });
});

app.delete("/users/:username/delete", (req, res) => {
    console.log("Deleting user: ", req.params.username);
    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500);
            res.send(err.message);
        } else {
            const users = JSON.parse(data);
            const hasName = users.some((user) => user.username === req.params.username);
            if (hasName) {
                const userIndex = users.findIndex((user) => user.username === req.params.username);
                if (userIndex !== -1) {
                    users.splice(userIndex, 1);
                }
                fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf-8", (writeErr) => {
                    if (writeErr) {
                        return res.status(500).send(writeErr.message);
                    }

                    res.status(200).end();
                });
            } else {
                return res.status(404).send({
                    error: "This user not found",
                });
            }
        }
    });
});

app.put("/users/:username/changeUser/change", checkBody(usernameSchema, telephoneSchema), (req, res) => {
    const changedUser = req.body;
    console.log("Change user:");
    console.log(changedUser);
    fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500);
            res.send(err.message);
        } else {
            const users = JSON.parse(data);
            const hasName = users.some((user) => user.username === req.params.username);
            if (hasName) {
                const userIndex = users.findIndex((user) => user.username === req.params.username);
                if (userIndex !== -1) {
                    users[userIndex].username = changedUser.username;
                    users[userIndex].email = changedUser.email;
                    users[userIndex].telephone = changedUser.telephone;
                }
                fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf-8", (writeErr) => {
                    if (writeErr) {
                        console.log("write error");
                        return res.status(500).send(writeErr.message);
                    }

                    res.status(200).end();
                });
            } else {
                console.log("User not found");
                return res.status(404).send({
                    error: "This user not found",
                });
            }
        }
    });
});

app.use((req, res) => {
    res.status(404).send("<h1>Page not found! Sorry!</h1>");
});

app.listen(port, () => {
    console.log("Server start");
});
