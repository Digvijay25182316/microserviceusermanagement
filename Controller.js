const { User } = require("./model");
//add user
exports.addUsers = async (req, res) => {
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
};
//getAllUsers
exports.getAllUsers = async (req, res) => {
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
};
//getOneUser
exports.getSingleUser = async (req, res) => {
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
};
//delete user
exports.deleteOneUser = async (req, res) => {
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
};
//update user
exports.updateUser = async (req, res) => {
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
};
//add notification to the user
exports.AddNotification = async (req, res) => {
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
};
//getNotification
exports.getNotification = async (req, res) => {
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
};
