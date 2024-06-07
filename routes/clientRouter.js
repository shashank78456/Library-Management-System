const express = require("express");
const router = express.Router();
const {verifyToken, createToken} = require("../auth");
const db = require("../config/db");

router.get("/home", verifyToken, (req,res) => {

    const sql = "SELECT bookname, bookid FROM Books WHERE quantity > 0";
    db.query(sql, (err,result)=>{
        if(err)
            res.sendStatus(500);
        else {
            let books = [];
            let bookids = [];
            for(let i=0; i<result.length; i++) {
                books.push(result[i].bookname);
                bookids.push(result[i].bookid);
            }
            res.render("clientHome",{books: books, bookids: bookids});
        }
    });
})

router.post("/home", verifyToken, (req,res) => {
    const user = req.user;
    const bookid = req.body.book;

    const sqluser = "SELECT userid FROM Users WHERE username = ?";
    db.query(sqluser, [user.username], (err,result) => {
        if(err)
            res.sendStatus(500);
        else {
            const userid = result[0].userid;
            const sqlcheck = "SELECT requestid FROM requests WHERE userid = ? AND bookid = ? AND ((currently = 0 AND is_accepted = 0) OR (currently = 1 AND is_accepted = 1))";
            db.query(sqlcheck, [userid, bookid], (err, result) => {
                if(err)
                    res.sendStatus(500);
                else if(result.length!=0)
                    res.status(200).send({isDone: false});
                else{
                    const sql = "INSERT INTO Requests (userid, bookid) VALUES (?, ?)";
                    db.query(sql, [userid, bookid], (err, result) => {
                        if(err)
                            res.sendStatus(500);
                        else
                            res.status(200).send({isDone: true});
                    });
                }
            });
        }
    });
})


router.get("/history", verifyToken, (req,res) => {
    const user = req.user;

    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [user.username], (err,result) => {
        if(err)
            res.sendStatus(500);
        else {
            const userid = result[0].userid;
            const sql = "SELECT bookid FROM Requests WHERE userid = ? AND is_accepted = 1";
            db.query(sql, [userid], (err,result) => {
                if(err)
                    res.sendStatus(500);
                else {
                    let history = [];
                    const limit = result.length-1;
                    for(let i=0; i<result.length; i++) {
                        let bookid = result[i].bookid;
                        const sqlbook = "SELECT bookname FROM Books WHERE bookid = ?";
                        db.query(sqlbook, [bookid], (err,result) => {
                            if(err)
                                res.sendStatus(500);
                            else {
                                history.push(result[0].bookname);
                                if(i===limit)
                                    res.render("clientHistory",{borrowBooks: history});
                            }
                        });
                    }
                    if(limit===-1)
                    res.render("clientHistory",{borrowBooks: history});
                }
            });
        }
    });
})

router.get("/return", verifyToken, (req,res) => {
    const user = req.user;

    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [user.username], (err,result) => {
        if(err)
            res.sendStatus(500);
        else {
            const userid = result[0].userid;
            const sql = "SELECT bookid FROM Requests WHERE userid = ? AND currently = 1";
            db.query(sql, [userid], (err,result) => {
                if(err)
                    res.sendStatus(500);
                else {
                    let books = [];
                    let bookids = [];
                    const limit = result.length-1;
                    for(let i=0; i<result.length; i++) {
                        const bookid = result[i].bookid;
                        const sqlbook = "SELECT bookname FROM Books WHERE bookid = ?";
                        db.query(sqlbook, [bookid], (err, result) => {
                            if(err)
                                res.sendStatus(500);
                            else {                            
                                books.push(result[0].bookname);
                                bookids.push(bookid);
                                if(i===limit) {
                                    res.render("clientReturn",{returnBooks: books, bookids: bookids});
                                }
                            }
                        });
                    }
                    if(limit===-1)
                        res.render("clientReturn",{returnBooks: books, bookids: bookids});
                }
            });
        }
    });
})

router.post("/return", verifyToken, (req,res) => {
    const book = req.body.bookToReturn;
    const user = req.user;

    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [user.username], (err, result) => {
        if(err)
            res.sendStatus(500);
        else {
            const userid = result[0].userid;
            const sql = "UPDATE Requests SET currently = 0, is_accepted = 1 WHERE bookid = ? AND userid = ?";
            db.query(sql, [book, userid], (err, result) => {
                if(err)
                    res.sendStatus(500);
                else
                    res.sendStatus(200);
            });
        }
    });
})

router.post("/adreq", verifyToken, (req,res) => {
    const hasRequested = req.body.hasRequested;
    const user = req.user;

    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [user.username], (err, result) => {
        if(err)
            res.sendStatus(500);
        else {
            const userid = result[0].userid;
            const sql = "UPDATE Users SET is_adminrequest = 1 WHERE userid = ?";
            db.query(sql, [userid], (err, result) => {
                if(err)
                    res.sendStatus(500);
                else
                    res.sendStatus(200);
            });
        }
    });
})

module.exports = router;