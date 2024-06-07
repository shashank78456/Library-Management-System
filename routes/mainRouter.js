const express = require("express");
const path = require("path");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const {verifyToken, createToken} = require("../auth");
const adminRouter = require("./adminRouter");
const clientRouter = require("./clientRouter");

router.get("/", (req,res) => {
    res.render("login");
})

router.post("/", async (req,res) => {
    const {userType, username, password} = req.body;

    const sql = `SELECT password FROM Users WHERE username = ? AND usertype = ?`;
    db.query(sql, [username, userType], async (err, result) => {
        if(err)
            return res.status(500).send(err.message);
        else if(result.length===0) {
            return res.send({isValid: false});
        }
        else {
            const opassword = result[0].password;
            const isSamePassword = await bcrypt.compare(password, opassword);

            if(isSamePassword) {
                const user = {username: username, password: password, userType: userType};
                const token = await createToken(user);
                res.status(200).cookie("token", token).send({isValid: true});
            }
            else{
                res.send({isValid: false});
            }
        }
    });

})

router.get("/signup", (req,res) => {
    res.render("signup");
})

router.post("/signup", async (req,res) => {
    const userType = "client";
    const {name, username, password} = req.body;

    const sqlCheck = `SELECT username FROM Users WHERE username = ?`;
    db.query(sqlCheck, [username], async (err, result) => {
        if(err)
            res.status(500).send(err.message);
        else if(result.length != 0) {
            return res.send({isValid: false});
        }
        else {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hpassword = await bcrypt.hash(password, salt);
            
            const sql1 = "SELECT userid FROM Users";
            db.query(sql1, (err, result) => {
                if(err)
                    res.sendStatus(500);
                else if(result.length===0){
                    const sql = `INSERT INTO Users (username, usertype, name, password, issuperadmin) VALUES (?, 'admin', ?, ?, 1)`;
                    db.query(sql, [username, name, hpassword], async (err, result) => {
                        if(err) {
                            res.sendStatus(500);
                        }
                        else {
                            const user = {username: username, password: password, userType: "admin"};
                            const token = await createToken(user);
                            res.status(200).cookie("token", token).send({isValid: true, userType: "admin"});
                        }
                    });
                }
                else {
                    const sql = `INSERT INTO Users (username, usertype, name, password) VALUES (?, ?, ?, ?)`;
                    db.query(sql, [username, userType, name, hpassword], async (err, result) => {
                        if(err) {
                            res.sendStatus(500);
                        }
                        else {
                            const user = {username: username, password: password, userType: userType};
                            const token = await createToken(user);
                            res.status(200).cookie("token", token).send({isValid: true, userType: "client"});
                        }
                    });
                }
            });
        }
    });
})

router.use("/client/", clientRouter);
router.use("/admin/", adminRouter);

module.exports = router;