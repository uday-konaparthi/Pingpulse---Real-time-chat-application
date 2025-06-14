const mongoose = require("mongoose");
const userSchema = require("../model/userSchema");
const { default: upload } = require("../utils/multerUpload");

const chatList = async (req, res) => {
  const userId = req.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  try {
    const currentUser = await userSchema.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // ✅ Fetch all users except the current user
    const users = await userSchema
      .find({ _id: { $ne: userId } })
      .select("-password");

    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // Assuming auth middleware sets this

    // Destructure actual fields (not `updateData` object)
    const { username, about } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID' });
    }

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (about !== undefined) updateData.about = about;

    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated', user: updatedUser });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfilePic = async (req, res) => {
   try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file || !req.file.path)
      return res.status(400).json({ message: "No file uploaded" });

    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      { profilePic: req.file.path },
      { new: true }
    );

    res.status(200).json({ message: "Avatar updated", profilePic: req.file.path });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { chatList, updateProfile, updateProfilePic }
