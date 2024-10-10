const express = require("express");
const router = express.Router();
const multer = require("multer");
const user = require("../Models/usermodels");
const path = require("path"); // Ensure to import path
const fs = require("fs");
const { Store } = require("express-session");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
});

router.post("/add", upload.single("image"), async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const imagepath = req.file.path;

    await user.create({
      name,
      email,
      phone,
      image: imagepath,
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error", error });
  }
});

router.get("/add", async (req, res) => {
  res.render("adduser", { title: "adduser" });
});

module.exports = router;

//add

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename : (req, file , cb ) =>{
//    cb(null , file.fieldname + " -" + Date.now() + "-" + file.originalname )
// }

// });

// const upload = multer({
//     Storage : Storage;
// })

// router.post('/add' , async( req, res) =>{
//     const {name , email , phone } = req.body;
//     try {
//         const imagepath = req.file.path;
//         await user.create({
//             name , email , phone , image : imagepath
//         })
//         res.redirect('/');
//     } catch (error) {
//         res.status(501).json({msg : " server error " , error })
//     }
// })

// //
// router.put('/update ' , (req , res ) =>{
//     const id = req.params.id;
//     const {name , email , phone , image} = req.body

//     try {
//         user.findoneandupdate({
//             name , email  , phone , image

//     } catch (error) {

//         })
//     }
// })
