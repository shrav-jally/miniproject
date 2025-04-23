const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Set both the user object and user ID
    req.user = user;
    req.userId = user._id;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = auth;
