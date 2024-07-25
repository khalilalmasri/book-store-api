const mongoose = require("mongoose");
const joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 20,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
//User model

// validation
function validateRegisterUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(20).required(),
    email: joi.string().trim().min(5).max(20).required().email(),
    password: joi.string().trim().min(6).required(),
    // isAdmin: joi.boolean(),
  });
  const result = schema.validate(obj);
  return result;
}
function validateLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).max(20).required().email(),
    password: joi.string().trim().min(6).required(),
  });
  const result = schema.validate(obj);
  return result;
}
function validateUpdateUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(20),
    email: joi.string().trim().min(5).max(20).email(),
    password: joi.string().trim().min(6),
    // isAdmin: joi.boolean(),
  });
  const result = schema.validate(obj);
  return result;
}

const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
