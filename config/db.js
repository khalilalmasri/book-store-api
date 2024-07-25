const mongoose = require("mongoose"); // للاتصال بقاعدة البيانات

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongodb");
  } catch (error) {
    console.log("connection failed", error);
  }
}

// mongoose
//       .connect(process.env.MONGO_URL)
//       .then(() => console.log("connected to mongodb"))
//   .catch((err) => console.log("connection failed", err));
module.exports = { connectToDB };
