const express = require("express");
require("dotenv").config();
const connectDB = require("./DB");
const {
  addUsers,
  getAllUsers,
  getSingleUser,
  AddNotification,
  getNotification,
  deleteOneUser,
  updateUser,
} = require("./Controller");
const { User } = require("./model");
const app = express();
//connecting the database
connectDB();
//defining schema to store the data in a specific structure

//body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//making requests
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "this is a microservice can be accessible throught apis",
  });
});
//add one user
app.post("/register", addUsers);
//get all users
app.get("/users", getAllUsers);
//get one user
app.get("/users/:address", getSingleUser);
//add one users notification
app.post("/addnotifications/:address", AddNotification);
//get one users notification
app.get("/getnotifications/:address", getNotification);
//delete one user
app.delete("/users/:address", deleteOneUser);

//update one users data
app.put("/users/:address", updateUser);
app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "you might have come to a wrong page",
  });
});
const PORT = process.env.PORT || 4053;
app.listen(PORT, () => {
  console.log(`Your app is running on http://localhost:${PORT}`);
});
