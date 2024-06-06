const express = require("express");
const router = express.Router();
const {verifyToken, } = require("../auth");
const db = require("../config/db");

router.get("/home", verifyToken, (req,res) => {

    const sql = "SELECT bookname, bookid FROM Books WHERE stat = 1";
    db.query(sql, (err,result)=>{
        if(err)
            res.sendStatus(500);
        else {
            let books = [];
            let bookids = [];
            for(let i=0; i<result.length; i++) {
                books.add(result[i].bookname);
                bookids.add(result[i].bookid);
            }
            res.render("clientHome",{books: books, bookids: bookids});
        }
    });
})

router.post("/home", verifyToken, (req,res) => {
    const user = req.user;
    const books = req.body.books;

    const sqluser = "SELECT userid FROM Users WHERE username = ?";
    db.query(sqluser, [user.username], (err,result) => {
        if(err)
            res.sendStatus(500);
        else {
            const userid = result[0].userid;
            for(let i=0; i<books.length; i++) {
                const bookid = books[i];
                const sql = "INSERT INTO Requests (userid, bookid) VALUES (?, ?)";
                db.query(sql, [userid, bookid], (err, result) => {
                    if(err)
                        res.sendStatus(500);
                    else
                        res.sendStatus(200);
                });
            }
        }
    });
})


router.get("/history", verifyToken, (req,res) => {

    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [username], (err,result) => {
        if(err)
            res.status(500);
        else {
            const userid = result;
            const sql = "SELECT bookname FROM Requests WHERE userid = ? AND stat = 1";
            db.query(sql, [userid], (err,result) => {
                if(err)
                    res.sendStatus(500);
                else {
                    let history = [];
                    for(let i=0; i<result.length; i++) {
                        history.add(result[i].bookname);
                    }
                    res.render("clientHistory",{borrowBooks: history});
                }
            });
        }
    });
})

router.get("/return", verifyToken, (req,res) => {

    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [username], (err,result) => {
        if(err)
            res.status(500);
        else {
            const userid = result[0].userid;
            const sql = "SELECT bookid FROM Requests WHERE userid = ? AND currently = 1";
            db.query(sql, [userid], (err,result) => {
                if(err)
                    res.sendStatus(500);
                else {
                    const sqlbook = "SELECT bookname, bookid FROM Books WHERE bookid = ?";
                    db.query(sqlbook, [bookid], (err, result) => {
                        if(err)
                            res.status(500);
                        else {
                            const books = [];
                            const bookids = [];
                            for(let i=0; i<result.length; i++) {
                                books.add(result[i].bookname);
                                bookids.add(result[i].bookid);
                            }
                            res.render("clientReturn",{returnBooks: books, bookids: bookids});
                        }
                    });
                }
            });
        }
    });
})

router.post("/return", verifyToken, (req,res) => {
    const books = req.body.booksToReturn;
    const user = req.user;

    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [user.username], (err, result) => {
        if(err)
            res.sendStatus(500);
        else {
            const userid = result[0].userid;
            for(let i=0; i<books.length; i++) {
                const sql = "UPDATE Requests SET currently = 0, stat = 0 WHERE bookid = ? AND userid = ?";
                db.query(sql, [books[i], userid], (err, result) => {
                    if(err)
                        res.status(500);
                    else
                        res.status(200);
                });
            }
        }
    });
})

router.post("/admin_request", verifyToken, (req,res) => {
    const hasRequested = req.body.hasRequested;
    const user = req.user;

    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [user.username], (err, result) => {
        if(err)
            res.sendStatus(500);
        else {
            const userid = result[0].userid;
            const sql = "UPDATE Users SET adminrequest = 1 WHERE userid = ?";
            db.query(sql, [userid], (err, result) => {
                if(err)
                    res.status(500);
                else
                    res.status(200);
            });
        }
    });
})

module.exports = router;