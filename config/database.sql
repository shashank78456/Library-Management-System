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

INSERT INTO Users (username, usertype, name, password, issuperadmin) VALUES ("superAdmin", "admin", "Super Admin", "$2y$10$gS.RSvzUYSkupoNrNPX1NOG3WAafSegNBMnQNEcjN3nsVSHnMzQ96", 1);
INSERT INTO Users (username, usertype, name, password) VALUES ("admin1", "admin", "admin1", "$2y$10$gS.RSvzUYSkupoNrNPX1NOG3WAafSegNBMnQNEcjN3nsVSHnMzQ96");

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

