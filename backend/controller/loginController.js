const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwt_tokens, refresh_tokens } = require("../models/Token");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password_hash } = req.body;
    // Tìm user theo email
    const user = await User.findOne({ email });
    // Kiểm tra user và mật khẩu
    if (!user || !user.password_hash || !(await bcrypt.compare(password_hash, user.password_hash))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Tạo Access Token (Có hiệu lực trong 2 giờ)
    const accessToken = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    // Tạo Refresh Token (Có hiệu lực trong 30 ngày)
    const refreshToken = jwt.sign(
      { user_id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );
    // Lưu Access Token vào database
    await jwt_tokens.create({
      user_id: user._id,
      role: user.role,
      token: accessToken,
      issued_at: new Date(),
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 giờ
      status: "active",
    });
    // Lưu Refresh Token vào database
    await refresh_tokens.create({
      user_id: user._id,
      refresh_token: refreshToken,
      issued_at: new Date(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
      used: false,
    });
    // Trả về Access Token và Refresh Token cho client
    res.json({ accessToken, refreshToken, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});




router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    // Kiểm tra Refresh Token trong database
    const storedRefreshToken = await refresh_tokens.findOne({
      refresh_token: refreshToken,
      used: false,
    });

    if (!storedRefreshToken) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // Xác thực Refresh Token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Tạo Access Token mới
      const newAccessToken = jwt.sign(
        { user_id: decoded.user_id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      // Lưu Access Token mới vào database
      await jwt_tokens.create({
        user_id: decoded.user_id,
        role: decoded.role,
        token: newAccessToken,
        issued_at: new Date(),
        expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: "active",
      });

      // Đánh dấu Refresh Token là đã sử dụng để tránh bị lợi dụng
      await refresh_tokens.updateOne(
        { refresh_token: refreshToken },
        { $set: { used: true } }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    user.password_hash = await bcrypt.hash(newPassword, 10);

    // Save the updated user
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


module.exports = router;