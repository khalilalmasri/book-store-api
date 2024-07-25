const express = require("express"); //import express
const router = express.Router(); // import router
const bcrypt = require("bcryptjs"); // import hash lipariry
const Jwt = require("jsonwebtoken");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
} = require("../models/User"); // import some from User.js
/**
 * @description register new user
 * @method POST
 * @route /api/auth/register
 * @access public
 */
// function to creat aner user
router.post("/register", async (req, res) => {
  try {
    //
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    //if email exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json("user already exists");
    } // variable and function for hash...
    const salt = await bcrypt.genSalt(10);
    // variable to save passowrd after hash...
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword, // use here
      isAdmin: req.body.isAdmin,
    });
    const result = await user.save(); //to save req in DB
    // const token = null; // token
    const token = Jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
    //to make req.body with out password
    const { password, ...other } = result._doc;
    // to response to user all data without password
    res.status(201).json({ ...other, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});

/**
 * @description login  user
 * @method POST
 * @route /api/auth/login
 * @access public
 */
// function to login user
router.post("/login", async (req, res) => {
  try {
    // first validate
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    //if email exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json("invalid email or password");
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json("invalid email or password");
    }
    // const token = null; // token
    // const token = Jwt.sign({ id: user._id , username:user.username }, process.env.JWT);
    const token = Jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
    //to make req.body with out password ////////  user
    const { password, ...other } = user._doc;
    // to response to user all data without password
    res.status(200).json({ ...other, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});
module.exports = router;
