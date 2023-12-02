const mongoose = require("mongoose");
async function connectDB() {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((data) => console.log("connected to cloud"))
    .catch((err) => console.log(err.message || err));
}

module.exports = connectDB;
