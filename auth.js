const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

export async function createToken(user) {
    return new Promise((resolve) => {
        const token = jwt.sign(user, process.env.SECRET_KEY, {expiresIn: "1h"}, (err, token) => {
            if(err)
                console.error(err);
            return token;
        });
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
            next();
        }
    });
}

module.exports = verifyToken;
