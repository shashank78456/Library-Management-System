const express = require("express");
const router = express.Router();
const {verifyToken, } = require("../auth");
const db = require("../config/db");

router.get("/home", verifyToken, (req,res) => {

    const sql = "SELECT bookname, bookid FROM Books WHERE stat = 1";
    db.query(sql, (err,result)=>{
        if(err)
            res.status(500);
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
    const books = req.books;

    const sqluser = "SELECT userid FROM Users WHERE username = ?";
    db.query(sqluser, [user.username], (err,result) => {
        if(err)
            res.status(500);
        else {
            const userid = result;
            for(let i=0; i<books.length; i++) {
                const bookid = books[i];
                const sql = "INSERT INTO Requests (userid, bookid) VALUES (?, ?)";
                db.query(sql, [userid, bookid], (err, result) => {
                    if(err)
                        res.status(500);
                    else
                        res.status(200);
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
            const sql = "SELECT bookid FROM BorrowBooks WHERE userid = ? AND currently = 0";
            db.query(sql, [userid], (err,result) => {
                if(err)
                    res.status(500).send(err.message);
                else
                    res.render("clientHistory",{borrowBooks: result});
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
            const userid = result;
            const sql = "SELECT bookid FROM BorrowBooks WHERE userid = ? AND currently = 1";
            db.query(sql, [userid], (err,result) => {
                if(err)
                    res.status(500);
                else if(result.length===0)
                    res.status(404).render("clientReturn");
                else{
                    const bookid = result;
                    const sqlbook = "SELECT bookname FROM Books WHERE bookid = ?";
                    db.query(sqlbook, [bookid], (err, result) => {
                        if(err)
                            res.status(500);
                        else
                            res.render("clientReturn",{returnBooks: result});
                    });
                }
            });
        }
    });
})

router.post("/return", verifyToken, (req,res) => {
    const books = req.booksToReturn;
    const user = req.user;

    let userid = "";
    const sql1 = "SELECT userid FROM Users WHERE username = ?";
    db.query(sql1, [user.username], (err, result) => {
        if(err)
            res.status(500);
        else 
            userid = result;
    });

    for(let i=0; i<books.length; i++) {
        const sql1 = "SELECT bookid FROM Books WHERE bookname = ?";
        let bookid = "";

        db.query(sql1, [books[i]], (err, result) => {
            if(err)
                res.status(500);
            else
                bookid = result;
                const sql = "UPDATE BorrowBooks SET currently = 0 WHERE bookid = ? AND userid = ?";
                db.query(sql, [bookid, userid], (err, result) => {
                    if(err)
                        res.status(500);
                    else
                        res.status(200);
                });
        });
    }
})

module.exports = router;