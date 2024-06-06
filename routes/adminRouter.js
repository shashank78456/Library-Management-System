const express = require("express");
const adminRouter = express.Router();
const {verifyToken, } = require("../auth");
const db = require("../config/db");

adminRouter.get("/home", verifyToken, (req,res) => {

    const sql = "SELECT bookname, stat FROM Books";
    db.query(sql, (err,result)=>{
        if(err)
            res.status(500).send(err.message);
        else if(result.length===0)
            res.status(404).render("adminHome");
        else{
            res.render("adminHome", {catalog: result[0], stat: result[1]});
        }
    });
})

adminRouter.post("/home", verifyToken, (req,res) => {
    const booksToAdd = req.booksToAdd;
    const booksToRemove = req.booksToRemove;
    
    for(let i=0; i<booksToAdd.length; i++) {
        let sql = "UPDATE Books SET stat = 1 WHERE bookname = ?";
        db.query(sql, [booksToAdd[i]], (err, result) => {
            if(err)
                res.status(500);
            else
                res.staus(200);
        });
    }
    for(let i=0; i<booksToRemove.length; i++) {
        let sql = "UPDATE Books SET stat = 0 WHERE bookname = ?";
        db.query(sql, [booksToRemove[i]], (err, result) => {
            if(err)
                res.status(500);
            else
                res.staus(200);
        });
    }
})

adminRouter.get("/add", verifyToken, (res,req) => {
    res.render("adminPrompt");
})

adminRouter.post("/add", verifyToken, (res,req) => {
    const book = req.book;
    
    const sql = "INSERT INTO Books (bookname) VALUES ?";
    db.query(sql, [book], (err,result) => {
        if(err)
            res.status(500);
        else
            res.status(200);
    });
})

adminRouter.get("/requests", verifyToken, (req,res) => {

    const sql1 = "SELECT userid, bookid FROM Requests";
    db.query(sql1, [username], (err,result) => {
        if(err)
            res.status(500).send(err.message);
        else {
            const userid = result[0];
            const bookid = result[1];
            const sqlb = "SELECT bookname FROM Books WHERE bookid = ?";
            db.query(sqlb, [bookid], (err,result) => {
                if(err)
                    res.status(500).send(err.message);
                else if(result.length===0)
                    res.status(404).render("adminRequests");
                else {
                    const bookname = result;
                    const sqlu = "SELECT username FROM Users WHERE userid = ?";
                    db.query(sqlu, [userid], (err,result) => {
                        if(err)
                            res.status(500).send(err.message);
                        else if(result.length===0)
                            res.status(404).render("adminRequests");
                        else {
                            const username = result;
                            res.render("adminRequests", {request: [bookname, username]});
                        }
                    });
                }
            });
        }
    });
})

adminRouter.post("/requests", verifyToken, (req,res) => {
    const usersAccept = req.usersAccept;
    const usersDeny = req.usersDeny;
    const bookAccept = req.bookAccept;
    const bookDeny = req.bookDeny;

    for(let i=0; i<usersAccept.length; i++) {
        let sql = "UPDATE Requests SET stat = 1 WHERE username = ? ";
        db.query(sql, [usersAccept[i]], (err,result) => {
            if(err)
                res.status(500);
            else{
                let userid="";
                let bookid="";
                let sqluser = "SELECT userid FROM Users WHERE username = ?";
                db.query(sqluser, [usersAccept[i]], (err,result) => {
                    if(err)
                        res.status(500);
                    else
                        userid = result;
                });

                let sqlbook = "SELECT bookid FROM Books WHERE bookname = ?";
                db.query(sqlbook, [bookAccept[i]], (err,result) => {
                    if(err)
                        res.status(500);
                    else
                        bookid = result;
                });

                let sql1 = "INSERT INTO Borrowbooks (userid, bookid, currently) VALUES (?, ?, 1)";
                db.query(sql1, [userid, bookid], (err,result) => {
                    if(err)
                        res.status(500);
                    else
                        res.status(200);
                });
            }
        });
    }

    for(let i=0; i<usersDeny.length; i++) {
        let sql = "UPDATE Requests SET stat = 0 WHERE username = ? ";
        db.query(sql, [usersAccept[i]], (err,result) => {
            if(err)
                res.status(500);
            else
                res.status(200);
        });
    }
})

module.exports = adminRouter;