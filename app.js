const express = require("express"); // express lip
// const bookspath = require("./routes/books"); // books route
// const autherspath = require("./routes/authers"); // author route
// const authpath = require("./routes/auth"); // auth route
// const userspath = require("./routes/users"); // auth route
// const mongoose = require("mongoose"); // للاتصال بقاعدة البيانات
const logger = require("./middleware/looger");
const { notFound, errorHandler } = require("./middleware/errors");
// const dotenv = require("dotenv"); // env lip
 require("dotenv").config(); // env lip
const {connectToDB} = require("./config/db");
// dotenv.config();


// connect to mongodb
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("connected to mongodb"))
//   .catch((err) => console.log("connection failed", err));

connectToDB();
// init App
// const express = require("express");انشاء متغير (آبب) = الدالة المعرفة بالبداية 
const app = express();
// apply middleware
app.use(express.json());
// apply routes

app.use(logger);
app.use("/api/books", require("./routes/books"));
// app.use("/api/books", bookspath);
app.use("/api/authers", require("./routes/authers"));
// app.use("/api/authers", autherspath);
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/auth", authpath);
app.use("/api/users", require("./routes/users"));
// app.use("/api/users", userspath);

// Error handler Middleware
// الترتيب هام جداً
app.use(notFound);
app.use(errorHandler);
//  إنشاء السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`server app listening in ${process.env.NODE_ENV} on port ${PORT}`)
);
