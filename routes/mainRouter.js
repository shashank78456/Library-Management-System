const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("./config/db");
const createToken = require("./auth");
const adminRouter = require("./adminRouter");
const clientRouter = require("./clientRouter");

router.get("/", (req,res) => {
    return res.sendFile(path.join(__dirname, "public", "login.html"));
})

router.post("/", async (req,res) => {
    const userType = req.body.userType;
    const username = req.body.username;
    const password = req.body.password;

    let opassword = "";
    let ouserType = ""; 
    const sql = `SELECT password, usertype FROM Users WHERE username = ?`;
    db.query = (sql, [username], (err, result) => {
        if(err)
            return res.status(500).send(err.message);
        else if(result.length===0) {
            return res.sendStatus(404);
        }
        else {
            opassword = result[0].password;
            ouserType = result[1].usertype;
        }
    });

    const isSamePassword = await bcrypt.compare(password, opassword);

    if(isSamePassword && userType===ouserType) {
        const user = {username: username, password: password, userType: userType};
        const token = await createToken(user);
        res.status(200).cookie("token", token);
        res.redirect(`/${userType}/home`);
    }
    else{
        res.sendStatus(404);
    }
})

router.get("/signup", (req,res) => {
    return res.sendFile(path.join(__dirname, "public", "signup.html"));
})

router.post("/signup", async  (req,res) => {
    const userType = "client";
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    const saltRounds = 20;
    const hpassword = await bcrypt.hash(password, saltRounds);

    const sqlCheck = `SELECT username FROM Users WHERE username = ?`;
    db.query = (sqlCheck, [username], (err, result) => {
        if(err)
            return res.status(500).send(err.message);
        else if(result.length != 0) {
            return res.sendStatus(404);
        }
        else{
            res.sendStatus(200);
            res.redirect(`/${userType}/home`);
        }
    });

    const sql = `INSERT INTO Users (username, usertype, name, password) VALUES (?, ?, ?, ?)`;
    db.query = (sql, [username, userType, name, hpassword], (err) => {
        if(err)
            return res.status(500).send(err.message);
        res.sendStatus(200);
    });

    const user = {username: username, password: password, userType: userType};
    const token = await createToken(user);
    res.status(200).cookie("token", token);
})

router.use("/client/", clientRouter);
router.use("/admin/", adminRouter);

module.exports = router;