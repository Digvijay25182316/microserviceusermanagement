const mongoose = require("mongoose");
const { isEmail } = require("validator");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Please enter a valid email"],
    unique: true,
  },
  wallet_address: {
    type: String,
    required: true,
    unique: [true, "user with this wallet address exists already"],
  },
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
exports.User = mongoose.model("Users", UserSchema);
