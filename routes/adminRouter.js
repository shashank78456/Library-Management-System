const express = require("express");
const router = express.Router();
const {verifyToken, } = require("../auth");
const db = require("../config/db");

router.get("/home", verifyToken, (req,res) => {
    const user = req.user;

    const sql = "SELECT bookid, bookname, stat FROM Books";
    db.query(sql, (err,result)=>{
        if(err)
            res.sendStatus(500);
        else{
            let bookids = [];
            let books = [];
            let stats = [];
            for(let i=0; i<result.length; i++) {
                bookids.push(result[i].bookid);
                books.push(result[i].bookname);
                stats.push(result[i].stat);
            }
            const sqlsup =  "SELECT issuperadmin FROM Users WHERE username = ?";
            db.query(sqlsup, [user.username], (err,result)=>{
                if(err)
                    res.sendStatus(500);
                else
                    res.render("adminHome", {catalog: books, stat: stats, bookids: bookids, isSuperAdmin: result[0].issuperadmin});
            });
        }
    });
})

router.post("/home", verifyToken, (req,res) => {
    const book = req.body.book;
    const isAccepted = req.body.isAccepted;
    if(isAccepted) {
        const sql = "UPDATE Books SET stat = 1 WHERE bookid = ?";
        db.query(sql, [book], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }

    else {
        let sql = "UPDATE Books SET stat = 0 WHERE bookid = ?";
        db.query(sql, [book], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }
})

router.get("/add", verifyToken, (req,res) => {
    res.render("adminPrompt");
})

router.post("/add", verifyToken, (req,res) => {
    const book = req.body.book;
    
    const sql = "INSERT INTO Books (bookname) VALUES (?)";
    db.query(sql, [book], (err,result) => {
        if(err)
            res.sendStatus(500);
        else
            res.sendStatus(200);
    });
})

router.get("/requests", verifyToken, (req,res) => {
    const user = req.user;

    const sql1 = "SELECT userid, bookid FROM Requests WHERE stat = 0";
    db.query(sql1, (err,result) => {
        if(err)
            res.sendStatus(500);
        else {
            let usernames = [];
            let userids = [];
            let books = [];
            let bookids = [];
            const limit = result.length-1;
            for(let i=0; i<result.length; i++) {
                let userid = result[i].userid;
                let bookid = result[i].bookid;
                const sqlb = "SELECT bookname FROM Books WHERE bookid = ?";
                db.query(sqlb, [bookid], (err,result) => {
                    if(err)
                        res.sendStatus(500);
                    else {
                        let bookname = result[0].bookname;
                        const sqlu = "SELECT username FROM Users WHERE userid = ?";
                        db.query(sqlu, [userid], (err,result) => {
                            if(err)
                                res.sendStatus(500);
                            else {
                                let username = result[0].username;
                                userids.push(userid);
                                usernames.push(username);
                                bookids.push(bookid);
                                books.push(bookname);
                                if(i===limit) {
                                    res.render("adminRequests", {userids: userids, usernames: usernames, bookids: bookids, books: books});
                                }
                            }
                        });
                    }
                });
            }
            if(limit===-1)
                res.render("adminRequests", {userids: userids, usernames: usernames, bookids: bookids, books: books});
        }
    });
})

router.post("/requests", verifyToken, (req,res) => {
    const user = req.body.user;
    const book = req.body.book;
    const isAccepted = req.body.isAccepted;
    if(isAccepted) {
        let sql = "UPDATE Requests SET stat = 1, currently = 1 WHERE userid = ? AND bookid = ? ";
        db.query(sql, [user, book], (err,result) => {
            if(err)
                res.sendStatus(500);
            else{
                res.sendStatus(200);
            }
        });
    }
})

router.get("/adreq", verifyToken, (req,res) => {

    const sql = "SELECT username, userid FROM Users WHERE adminrequest = 1";
    db.query(sql, (err, result) => {
        if(err)
            res.status(500);
        else {
            let users = [];
            let userids = [];
            for(let i=0; i<result.length; i++) {
                users.push(result[i].username);
                userids.push(result[i].userid);
            }
            res.render("adminSuper", {users: users, userids: userids});
        }
    });
})

router.post("/adreq", verifyToken, (req,res) => {
    const user = req.body.user;
    const isAccepted = req.body.isAccepted;

    if(isAccepted) {
        const sql = "UPDATE Users SET adminrequest = 0, usertype = 'admin' WHERE userid = ?";
        db.query(sql, [user], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }

    else {
        const sql = "UPDATE Users SET adminrequest = 0 WHERE userid = ?";
        db.query(sql, [user], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }
})

module.exports = router;