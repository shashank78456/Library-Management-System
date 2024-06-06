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
                bookids.add(result[i].bookid);
                books.add(result[i].bookname);
                stats.add(result[i].stat);
            }
            const sqlsup =  "SELECT issuperadmin FROM Users WHERE username = ?";
            db.query(sqlsup, (err,result)=>{
                if(err)
                    res.sendStatus(500);
                else
                    res.render("adminHome", {catalog: books, stat: stats, bookids: bookids, isSuperAdmin: result[0].issuperadmin});
            });
        }
    });
})

router.post("/home", verifyToken, (req,res) => {
    const booksToAdd = req.body.booksToAdd;
    const booksToRemove = req.body.booksToRemove;
    
    for(let i=0; i<booksToAdd.length; i++) {
        let sql = "UPDATE Books SET stat = 1 WHERE bookid = ?";
        db.query(sql, [booksToAdd[i]], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }

    for(let i=0; i<booksToRemove.length; i++) {
        let sql = "UPDATE Books SET stat = 0 WHERE bookid = ?";
        db.query(sql, [booksToRemove[i]], (err, result) => {
            if(err)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        });
    }
})

router.get("/add", verifyToken, (res,req) => {
    res.render("adminPrompt");
})

router.post("/add", verifyToken, (res,req) => {
    const book = req.body.book;
    
    const sql = "INSERT INTO Books (bookname) VALUES ?";
    db.query(sql, [book], (err,result) => {
        if(err)
            res.sendStatus(500);
        else
            res.sendStatus(200);
    });
})

router.get("/requests", verifyToken, (req,res) => {

    const sql1 = "SELECT userid, bookid FROM Requests WHERE stat = 0";
    db.query(sql1, [username], (err,result) => {
        if(err)
            res.sendStatus(500);
        else {
            let usernames = [];
            let userids = [];
            let books = [];
            let bookids = [];
            for(let i=0; i<result.length; i++) {
                const userid = result[i].userid;
                const bookid = result[i].bookid;
                const sqlb = "SELECT bookname FROM Books WHERE bookid = ?";
                db.query(sqlb, [bookid], (err,result) => {
                    if(err)
                        res.sendStatus(500);
                    else {
                        const bookname = result[0].bookid;
                        const sqlu = "SELECT username FROM Users WHERE userid = ?";
                        db.query(sqlu, [userid], (err,result) => {
                            if(err)
                                res.sendStatus(500);
                            else {
                                const username = result[0].userid;
                                userids.add(userid);
                                usernames.add(username);
                                bookids.add(bookid);
                                books.add(bookname);
                            }
                        });
                    }
                });
            }
            res.render("adminRequests", {userids: userids, usernames: usernames, bookids: bookids, books: books});
        }
    });
})

router.post("/requests", verifyToken, (req,res) => {
    const usersAccept = req.body.usersAccept;
    const usersDeny = req.body.usersDeny;
    const bookAccept = req.body.bookAccept;
    const bookDeny = req.body.bookDeny;

    for(let i=0; i<usersAccept.length; i++) {
        let sql = "UPDATE Requests SET stat = 1, currently = 1 WHERE userid = ? AND bookid = ? ";
        db.query(sql, [usersAccept[i], bookAccept[i]], (err,result) => {
            if(err)
                res.sendStatus(500);
            else{
                res.sendStatus(200);
            }
        });
    }

    for(let i=0; i<usersDeny.length; i++) {
        let sql = "UPDATE Requests SET stat = 0, currently = 0 WHERE userid = ? AND bookid = ?";
        db.query(sql, [usersDeny[i], bookDeny[i]], (err,result) => {
            if(err)
                res.status(500);
            else
                res.status(200);
        });
    }
})

module.exports = router;

router.get("/adreq", verifyToken, (req,res) => {

    const sql = "SELECT username, userid FROM Users WHERE adminrequest = 1";
    db.sql(sql, (res,req) => {
        if(err)
            res.status(500);
        else {
            let users = [];
            let userids = [];
            for(let i=0; i<result.length; i++) {
                users.add(result[i].username);
                userids.add(result[i].userid);
            }
            res.render("adminSuper", {users: users, userids: userids});
        }
    });
})

router.post("/adreq", verifyToken, (req,res) => {
    usersAccept = req.body.usersAcceptR;
    usersDeny = req.body.usersDenyR;

    for(let i=0; usersAccept.length; i++) {
        const sql = "UPDATE Users SET adminrequest = 0, usertype = admin WHERE userid = ?";
        db.query(sql, [usersAccept], (err, result) => {
            if(err)
                res.status(500);
            else
                res.status(200);
        });
    }

    for(let i=0; usersDeny.length; i++) {
        const sql = "UPDATE Users SET adminrequest = 0 WHERE userid = ?";
        db.query(sql, [usersDeny], (err, result) => {
            if(err)
                res.status(500);
            else
                res.status(200);
        });
    }
})