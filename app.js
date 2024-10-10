require("dotenv").config();
const express = require("express");
const express_session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const fs = require("fs");
const user = require("./Routes/updateUser.routes");
const port = process.env.PORT || 7000;
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");
const adduser = require("./Routes/adduser.route");

const router = require("./Routes/user.routes");
app.use(router);
app.use(adduser);

const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use(express.json());
app.use(user);
app.use(express.urlencoded({ extended: true })); // For URL-encoded data (form submissions)
app.use(express.json()); // For JSON data
app.use(methodOverride("_method"));
const dbConnect = async () => {
  try {
    const db_urls = process.env.DB_URL;

    mongoose.connect(db_urls || "mongodb://localhost:27017/Touseef-CRUD");
    console.log("dbconnected");
  } catch (error) {
    console.error(error);
  }
};

dbConnect();

app.listen(port, () => {
  console.log(`server started at  ${port}`);
});
