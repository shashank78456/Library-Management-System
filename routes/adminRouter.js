const express = require("express");
const router = express.Router();
const {verifyToken, createToken} = require("../auth");
const db = require("../config/db");

router.get("/home", verifyToken, (req,res) => {
    const user = req.user;

    const sql = "SELECT bookid, bookname, is_available FROM Books";
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
                stats.push(result[i].is_available);
            }
            const sqlsup =  "SELECT issuperadmin FROM Users WHERE username = ?";
            db.query(sqlsup, [user.username], (err,result)=>{
                if(err)
                    res.sendStatus(500);
                else
                    res.render("adminHome", {catalog: books, stats: stats, bookids: bookids, isSuperAdmin: result[0].issuperadmin});
            });
        }
    });
})

router.post("/home", verifyToken, (req,res) => {
    const book = req.body.book;
    const isAccepted = req.body.isAccepted;

    if(isAccepted) {
        const sql = "UPDATE Books SET is_available = 1 WHERE bookid = ?";
        db.query(sql, [book], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }
    else {
        const sql = "UPDATE Books SET is_available = 0 WHERE bookid = ?";
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
    
    const sqlcheck = "SELECT bookid FROM Books WHERE bookname = ?";
    db.query(sqlcheck, [book], (err,result) => {
        if(err) {console.log(err.message)
            res.sendStatus(500);}
        else if(result.length!=0) {
            res.send({isDone: false});
        }
        else {
            const sql = "INSERT INTO Books (bookname) VALUES (?)";
            db.query(sql, [book], (err,result) => {
                if(err)
                    res.sendStatus(500);
                else
                    res.send({isDone: true});
            });
        }
    });
})

router.get("/requests", verifyToken, (req,res) => {
    const user = req.user;

    const sql1 = "SELECT userid, bookid, requestid FROM Requests WHERE is_accepted = 0";
    db.query(sql1, (err,result) => {
        if(err)
            res.sendStatus(500);
        else {
            let usernames = [];
            let userids = [];
            let books = [];
            let bookids = [];
            let requestids = [];
            const limit = result.length-1;
            for(let i=0; i<result.length; i++) {
                let userid = result[i].userid;
                let bookid = result[i].bookid;
                let requestid = result[i].requestid;
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
                                requestids.push(requestid);
                                if(i===limit) {
                                    res.render("adminRequests", {userids: userids, usernames: usernames, bookids: bookids, books: books, requestids: requestids});
                                }
                            }
                        });
                    }
                });
            }
            if(limit===-1)
                res.render("adminRequests", {userids: userids, usernames: usernames, bookids: bookids, books: books, requestids: requestids});
        }
    });
})

router.post("/requests", verifyToken, (req,res) => {
    const requestid = req.body.requestid;
    const isAccepted = req.body.isAccepted;
    if(isAccepted) {
        let sql = "UPDATE Requests SET is_accepted = 1, currently = 1 WHERE requestid = ? ";
        db.query(sql, [requestid], (err,result) => {
            if(err)
                res.sendStatus(500);
            else{
                res.sendStatus(200);
            }
        });
    }
})

router.get("/adreq", verifyToken, (req,res) => {

    const sql = "SELECT username, userid FROM Users WHERE is_adminrequest = 1";
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
        const sql = "UPDATE Users SET is_adminrequest = 0, usertype = 'admin' WHERE userid = ?";
        db.query(sql, [user], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }

    else {
        const sql = "UPDATE Users SET is_adminrequest = 0 WHERE userid = ?";
        db.query(sql, [user], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }
})

module.exports = router;