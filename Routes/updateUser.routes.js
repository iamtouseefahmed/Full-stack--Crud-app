const express = require("express");
const router = express.Router();
const multer = require("multer");
const user = require("../Models/usermodels");
const path = require("path"); // Ensure to import path
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// Assume this is in your route handler where you update user data
router.put("/update/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { name, email, phone, old_image } = req.body;

  try {
    const userData = await user.findById(id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    userData.name = name || userData.name;
    userData.email = email || userData.email;
    userData.phone = phone || userData.phone;

    // Handle image update
    if (req.file) {
      // If there is an uploaded image, delete the old image
      if (old_image && fs.existsSync(old_image)) {
        fs.unlink(old_image, (err) => {
          if (err) {
            console.error(`Error deleting image file: ${err.message}`);
          }
        });
      }
      userData.image = req.file.path; // Update with new image path
    }

    await userData.save();

    res
      .status(200)
      .json({ message: "User updated successfully", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
