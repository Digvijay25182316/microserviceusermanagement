const {
  addUsers,
  getAllUsers,
  getSingleUser,
  AddNotification,
  getNotification,
  deleteOneUser,
  updateUser,
} = require("../controllers/Controller");
const express = require("express");

const router = express.Router();

//making requests
router.route("/").get(async (req, res) => {
  res.json({
    success: true,
    message: "this is a microservice can be accessible throught apis",
  });
});
//add one user
router.route("/register").post(addUsers);
//get all users
router.route("/users").get(getAllUsers);
//get one user
router.route("/users/:address").get(getSingleUser);
//add one users notification
router.route("/addnotifications/:address").post(AddNotification);
//get one users notification
router.route("/getnotifications/:address").get(getNotification);
//delete one user
router.route("/users/:address").delete(deleteOneUser);

//update one users data
router.route("/users/:address").put(updateUser);
router.route("*").get(async (req, res) => {
  res.status(404).json({
    success: false,
    message: "you might have come to a wrong page",
  });
});

module.exports = router;
