const express = require("express");
const router = express.Router();
const multer = require("multer");
const user = require("../Models/usermodels");
const fs = require("fs");
const session = require("express-session");

//image upload
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
}).single("image");

router.get("/", async (req, res) => {
  try {
    const users = await user.find().exec(); // Await the promise
    res.render("index", {
      title: "home page",
      users: users, // Pass the users data to the view
    });
  } catch (err) {
    res.json({ message: err.message }); // Handle any errors
  }
});

router.get("/edit/:id", async (req, res) => {
  let id = req.params.id;

  try {
    let userData = await user.findById(id); // Await the result of the Promise
    if (userData == null) {
      res.redirect("/");
    } else {
      res.render("edituser", {
        title: "Edit User",
        user: userData, // Use the fetched user data
      });
    }
  } catch (err) {
    res.redirect("/");
  }
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await user.findByIdAndDelete(id);

    if (result && result.image) {
      try {
        await fs.unlink("./uploads/" + result.image);
      } catch (err) {
        console.log("Error deleting image file:", err);
      }
    }

    // Check if req.session is available
    if (req.session) {
      req.session.message = {
        type: "info",
        message: "User deleted successfully!",
      };
    }

    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
