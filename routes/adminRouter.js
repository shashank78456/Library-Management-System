const express = require("express");
const adminRouter = express.Router();
const verifyToken = require("./auth");
const db = require("./config/db");

router.get("/home", verifyToken, (req,res) => {
    const user = req.user;

    res.render("adminHome")
})

module.exports = adminRouter;