const express = require("express");

const router = express.Router();

const Model = require("../models");
const { encrypt } = require("../utils/encrypt");
const bcrypt = require("bcryptjs");

// password encrypt middleware
const passwordMiddleware = (req, res, next) => {
  if (req.body && req.body.password) {
    const password = req.body.password;
    const encryptedPassword = encrypt(password);
    req.encryptedPassword = encryptedPassword;
  }
  next();
};

// Save User
router.post("/register", passwordMiddleware, async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const encryptedPassword = req.encryptedPassword;
  // console.log(encryptedPassword);
  const user = await Model.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: "User already exists." });
  } else {
    const data = new Model({
      first_name,
      last_name,
      email,
      password: encryptedPassword,
    });
    try {
      const savedData = await data.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }
 
});

// Get All Users
router.get("/getAll", async (req, res) => {
  try {
    const data = await Model.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Get One User by ID
router.get("/getById/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options);

    res.status(200).send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res
      .status(200)
      .send(
        `Document with ${data.first_name} ${data.last_name} has been deleted..`
      );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// user login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  try {
    const user = await Model.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "User does not exist.", result: false });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Incorrect password.", result: false });
    res.status(200).json({
      msg: "Successfully Logged In.",
      result: true,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
