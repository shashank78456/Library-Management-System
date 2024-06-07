const jwt = require("jsonwebtoken");
const db = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();

async function createToken(user) {
    return new Promise((resolve) => {
        const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: "1h"});
        resolve(token);
    });
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if(err)
            return res.sendStatus(403);
        else {
            req.user = user;
            const userType = user.userType;
            const username = user.username;
            const reqUserType = req.originalUrl.split("/")[1];
            if(reqUserType===userType)
                next();
            else
                return res.sendStatus(403);
        }
    });
}

module.exports = {verifyToken, createToken};
