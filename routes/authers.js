const express = require("express");
const {} = require("../models/author");
const asyncHandler = require("express-async-handler");// مكتبة تمكننا من تنفيذ كود تراي وكاتش من دون كتابته لم أحبها كثيراً

const router = express.Router();

const {
  Author,
  validateCreateauther,
  validateUpdateAuthers,
} = require("../models/author");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

// const authers = [
//   {
//     id: 1,
//     Firstname: "basam",
//     lastname: " almasri",
//     location: "damascus",
//     image: "image-image.png",
//   },
//   {
//     id: 2,
//     Firstname: "seham",
//     lastname: " almasri",
//     location: "caero",
//     image: "image-image.jpg",
//   },
// ];

/**
 * @description get all authers
 * @method GET
 * @route /api/authers
 * @access public
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const authorList = await Author.find();
    res.status(200).json(authorList);
  })
);
// router.get("/", async (req, res) => {
//   try {
// الدوال التالية هي دوال مدمجة بالمانجو دي بي ال
// find لإحضار الداتا
// sort للترتيب
// select للتحديد
//     const authorList = await Author.find().sort({ Firstname: -1 });
//     // .select("Firstname , lastname -_id");
//     res.status(200).json(authorList);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

/**
 * @description get authers by id
 * @method GET
 * @route /api/authers/:id
 * @access public
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // const auther = authers.find((b) => b.id === parseInt(req.params.id));
    // try {
    const auther = await Author.findById(req.params.id);
    if (auther) {
      res.status(200).json(auther);
    } else {
      res.status(404).send("auther not found");
    }
    // } catch (error) {
    // res.status(500).json({ message: "error.message" });
    // res.status(500).json({ message: "error.message.tiString()" });
    // }
  })
);

/**
 * @description create new auther
 * @method POST
 * @route /api/authers
 * @access private (only admin )
 */
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateCreateauther(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  try {
    const author = new Author({
      Firstname: req.body.Firstname,
      lastname: req.body.lastname,
      location: req.body.location,
      image: req.body.image,
    });
    const result = await author.save();
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  // const newData = {id: authers.length + 1,
  //   Firstname: req.body.Firstname,
  //   lastname: req.body.lastname,
  //   location: req.body.location,
  //   image: req.body.image,
  // };
  // authers.push(newData);
  // res.status(201).json(newData);
});
/**
 * @description update auther by id
 * @method PUT
 * @route /api/authers/:id
 * @access private (only admin )
 */
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateUpdateAuthers(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  //   const book = authers.find((b) => b.id === parseInt(req.params.id));
  //   if (!book) {
  //     return res.status(404).send("auther not found");
  //   } else if (book) {
  //     return res.status(200).json("update authers successfully");
  //   }
  try {
    // findByIdAndUpdate اضافة الدالة الجديدة للتعديل
    //  تأخذ 3 متغيرات الأول هو الااي دي المراد تعديله
    const result = await Author.findByIdAndUpdate(
      req.params.id,
      {
        //  الثاني هو اوبجيكت يحوي البدي المراد تعديله بعد كتابة $set
        $set: {
          Firstname: req.body.Firstname,
          lastname: req.body.lastname,
          location: req.body.location,
          image: req.body.image,
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
 * @access private (only admin )
 */
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  // const auther = authers.find((b) => b.id === parseInt(req.params.id));
  try {
    const auther = await Author.findById(req.params.id);
    if (auther) {
      await Author.findByIdAndDelete(req.params.id);
      return res.status(200).json("deleted successfully");
    } else {
      res.status(404).send("auther not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error.message" });
  }
});

module.exports = router;
