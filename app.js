const express = require ("express");
const app = express();
const path = require("path");
const router = require("./routes/mainRouter");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
dotenv.config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/", router);

app.listen(3000, () =>{
    console.log("Running");
});
