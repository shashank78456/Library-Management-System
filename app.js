const express = require ("express");
const app = express();
const path = require("path");
const router = require("./routes/mainRouter");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/", router);

app.listen(3000, () =>{
    console.log("Running");
});
