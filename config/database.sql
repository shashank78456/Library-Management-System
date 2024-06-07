CREATE DATABASE Library;
USE Library;

CREATE TABLE Users (
    userid INT AUTO_INCREMENT NOT NULL,
    username varchar(255) DEFAULT NULL,
    usertype enum('client','admin') DEFAULT 'client',
    name varchar(255) DEFAULT NULL,
    password varchar(1024) DEFAULT NULL,
    issuperadmin INT DEFAULT 0,
    adminrequest INT DEFAULT 0,
    PRIMARY KEY (userid)
);

CREATE TABLE Books (
    bookid INT AUTO_INCREMENT NOT NULL,
    bookname varchar(1024) DEFAULT NULL,
    stat INT DEFAULT 0,
    PRIMARY KEY (bookid)
);

CREATE TABLE Requests (
    requestid INT AUTO_INCREMENT NOT NULL,
    userid INT,
    bookid INT,
    stat INT DEFAULT 0,
    currently INT DEFAULT 0,
    PRIMARY KEY (requestid),
    FOREIGN KEY (userid) REFERENCES Users(userid),
    FOREIGN KEY (bookid) REFERENCES Books(bookid)
);

