const express = require("express");
const {
  Book,
  validateCreateBook,
  validateUpdateBook,
} = require("../models/books");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

// const {} = require("../models/books");

const router = express.Router();

// const books = [ {id: 1,name: "bassam",auther: "basam almasri", describtion: "qweqwe",price: 10,cover: "qwe",  },];
// (req, res) تتكون الفانكشن من 2 باراميتر الأول المسار والثاني
// router.get("/", (req, res) => {
//   res.send("Hello bassam khalil!");
// });
/**
 * @description get all books
 * @method GET
 * @route /api/books
 * @access public
 */
// router.get("/",
//   (req, res) => {
//   res.json(books);
// });
router.get("/", async (req, res, next) => {
  try {
    const bookList = await Book.find().populate("auther", [
      "_id",
      "firstname",
      "lastname",
    ]); // هذه الفانكشن الأخيرة تجلب العنصر كاملاً وليس فقط الأي دي
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @description get books by id
 * @method GET
 * @route /api/books/:id
 * @access public
 */
router.get("/:id", (req, res) => {
  const book = Book.findById(req.params.id).populate("auther");
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).send("book not found");
  }
});

/**
 * @description create vew book
 * @method POST
 * @route /api/books
 * @access private
 */
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateCreateBook(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  const newBook = new Book({
    name: req.body.name,
    auther: req.body.auther,
    describtion: req.body.describtion,
    price: req.body.price,
    cover: req.body.cover,
  });
  const result = await newBook.save();
  res.status(201).json(result);
});
/**
 * @description update book by id
 * @method PUT
 * @route /api/books/:id
 * @access private
 */
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateUpdateBook(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  try {
    const result = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          auther: req.body.auther,
          describtion: req.body.describtion,
          price: req.body.price,
          cover: req.body.cover,
        },
      }, // الثالث هو خيار ارجاع الأوبجيكت الجديد أو القديم
      { new: true }
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "error.message" });
  }
});
/**
 * @description delete auther by id
 * @method DELETE
 * @route /api/authers/:id
 * @access private
 */
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedbook = await Book.findById(req.params.id);
    if (deletedbook) {
      await Book.findByIdAndDelete(req.params.id);
      return res.status(200).json("deleted successfully");
    } else {
      res.status(404).send("book not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});

module.exports = router;
