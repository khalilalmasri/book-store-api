const mongoose = require("mongoose");
const joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    auther: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    describtion: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 200,
    },
    price: {
      type: Number,
      required: true,
    },
    cover: { type: String, required: true, enum: ["Hardcover", "Paperback"] },
  },
  { timestamps: true }
);

function validateCreateBook(newbookbody) {
  const schema = joi.object({
    name: joi.string().trim().min(3).max(20).required().messages({
      "any.required": "الاسم مطلوب",
      "string.base": "الاسم لازم يكون من نوع نص",
      "string.empty": ".....رجاء ادخال الاسم",
      "string.min": "لا يجوز الاسم يكون اقل من ثلاثة حروف",
      "string.max": "لا يجوز الاسم يكون اكثر من 20 حروف",
    }),
    auther: joi.string().min(3).required(),
    describtion: joi.string().min(3).required(),
    price: joi.number().min(0).required(),
    cover: joi.string().valid("Hardcover", "Paperback").required(),
  });
  // variable for validation state
  const result = schema.validate(newbookbody);
  return result;
}
function validateUpdateBook(bookbody) {
  const schema = joi.object({
    name: joi.string().trim().min(3).max(20),
    auther: joi.string().min(3),
    describtion: joi.string().min(3),
    price: joi.number().min(0),
    cover: joi.string().valid("Hardcover", "Paperback"),
  });
  // variable for validation state
  const result = schema.validate(bookbody);
  return result;
}

const Book = mongoose.model("Book", BookSchema);
module.exports = { Book, validateCreateBook, validateUpdateBook };
