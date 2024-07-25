// استيراد الموديل
const mongoose = require("mongoose");
const joi = require("joi");
// مخطط البيانات
const authorSchema = new mongoose.Schema(
  {
    Firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    image: { type: String, default: "aaa.png" },
  },
  // مؤقت زمني للعمليات
  { timestamps: true }
);
function validateCreateauther(newautherbody) {
  const schema = joi.object({
    Firstname: joi.string().trim().min(3).max(20).required(),
    lastname: joi.string().trim().min(3).max(20).required(),
    location: joi.string().trim().min(3).max(20).required(),
    image: joi.string().min(0).required(),
  });
  // variable for validation state
  const result = schema.validate(newautherbody);
  return result;
}
function validateUpdateAuthers(newautherbody) {
  const schema = joi.object({
    Firstname: joi.string().trim().min(3).max(20),
    lastname: joi.string().min(3),
    location: joi.string().min(3),
    image: joi.string().min(0),
  });
  // variable for validation state
  const result = schema.validate(newautherbody);
  return result;
}
// طلب انشء قاعدة البيانات بجمع الاسم
const Author = mongoose.model("Author", authorSchema);
module.exports = { Author, validateCreateauther, validateUpdateAuthers };
