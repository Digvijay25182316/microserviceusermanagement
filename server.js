const express = require("express");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
require("dotenv").config();
const app = express();
//connecting the database
async function connectDB() {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((data) => console.log("connected to cloud"))
    .catch((err) => console.log(err.message || err));
}
connectDB();
//defining schema to store the data in a specific structure
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Please enter a valid email"],
    unique: true,
  },
  wallet_address: { type: String, required: true },
  transactionHistory: [
    { transactionHash: String, createdAt: { type: Date, default: Date.now() } },
  ],
  notifications: [
    {
      category: String,
      message: String,
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  createdAt: { type: Date, default: Date.now() },
});
//modeling the schema to use in apis and requests
const User = mongoose.model("Users", UserSchema);
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
app.post("/register", async (req, res) => {
  const { name, email, wallet_address } = req.body;
  try {
    if (!name || !email || !wallet_address) {
      res
        .status(400)
        .json({ success: false, message: "complete the given fields" });
      return;
    }
    const users = await User.create({
      name,
      email,
      wallet_address,
    });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
});
//get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select(
      "name email wallet_address createdAt"
    );
    if (!users || users.length === 0) {
      res.status(400).json({
        success: false,
        message: "No users to show",
      });
      return;
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
});
//get one user
app.get("/users/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const users = await User.findOne({ wallet_address: address }).select(
      "name email wallet_address createdAt"
    );
    if (!users) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
});
//add one users notification
app.post("/addnotifications/:address", async (req, res) => {
  const { address } = req.params;
  const { category, message } = req.body;
  try {
    if (!category || !message) {
      res.status(400).json({
        success: false,
        message: "complete all the fields",
      });
      return;
    }
    const users = await User.findOne({ wallet_address: address });
    if (!users) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }
    const user = await users.updateOne(
      { $push: { notifications: { category, message } } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
});
//get one users notification
app.get("/getnotifications/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const users = await User.findOne({ wallet_address: address }).select(
      "notifications"
    );
    if (!users) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
});
//delete one user
app.delete("/users/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const users = await User.findOne({ wallet_address: address });
    if (!users) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }
    await users.deleteOne();
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
});

//update one users data
app.put("/users/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const users = await User.findOne({ wallet_address: address });
    if (!users) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
      return;
    }
    // Extract all fields from req.body for dynamic update
    const updateFields = { ...req.body };
    await users.updateOne({ $set: updateFields });
    res.status(200).json({
      success: true,
      message: "updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
});
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
