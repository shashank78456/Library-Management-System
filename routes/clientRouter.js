const express = require("express");
const clientRouter = express.Router();
const verifyToken = require("./auth");
const db = require("./config/db");

router.get("/home", verifyToken, (req,res) => {
    const user = req.user;

    res.render("clientHome");
})

module.exports = clientRouter;