const express = require("express"); //import express
const router = express.Router(); // import router
const bcrypt = require("bcryptjs"); // import hash lipariry
const { User, validateUpdateUser } = require("../models/User"); // import some from User.js
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
/**
 * @description update user
 * @method PUT
 * @route /api/users/:id
 * @access private
 */
// function to update user fisrt route then verify token then update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //
  try {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    if (req.body.password) {
      // hash password if was found
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    const result = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          //   isAdmin: req.body.isAdmin,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});

/**
 * @description get all user
 * @method GET
 * @route /api/users
 * @access private (only admin can access)
 */
// function to update user fisrt route then verify token then update
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  //
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});

/**
 * @description get user by id
 * @method GET
 * @route /api/users/:id
 * @access private (only admin  and user him self)
 */
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
      res.status(200).json(user);
    } else res.status(404).json({ message: "user not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});
/**
 * @description delete user by id
 * @method delete
 * @route /api/users/:id
 * @access private (only admin  and user him self)
 */

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "deleted successfully" });
    } else res.status(404).json({ message: "user not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});

module.exports = router;
