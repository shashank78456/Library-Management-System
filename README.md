## Library Management System

The first user to signup has superadmin privileges.
Only superadmin can accept or deny clients seeking admin privileges.

Users cannot signup as admin.

To create database:
```
mysql -u test -p < ./config/database.sql
```
Replace test by your mysql username.

To start the server execute:
``` node app.js
```

Clients can borrow books by making a borrow request which is approved by the admin.
Clients can return books and access their borrow history. Clients can request for admin privileges.

Admins ca approve borrow requests, add new books in the catalog, make a book available for borrowing or disable borrowing of book. 

