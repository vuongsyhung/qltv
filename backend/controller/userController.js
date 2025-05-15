const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authenticateToken = require("../middleware/checktoken");
const express = require("express");
const router = express.Router();


// Tạo người dùng mới
router.post("/register", async (req, res) => {
  try {
    const { name, email, password_hash, role, user_id, extra_info } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password_hash || !role) {
      return res.status(400).json({ message: "Tên, email, mật khẩu và vai trò là bắt buộc" });
    }

    // Kiểm tra role hợp lệ
    const validRoles = ["student", "teacher", "library_staff"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    // Xử lý extra_info theo role
    let processedExtraInfo = {};
    if (role === "student") {
      const { department, year } = extra_info || {};
      if (!department || !year) {
        return res.status(400).json({ message: "Sinh viên cần cung cấp department và year" });
      }
      processedExtraInfo = { department, year };
    } else if (role === "teacher") {
      const { department, position } = extra_info || {};
      if (!department || !position) {
        return res.status(400).json({ message: "Giáo viên cần cung cấp department và position" });
      }
      processedExtraInfo = { department, position };
    } else if (role === "library_staff") {
      const { position, work_shift } = extra_info || {};
      if (!position || !work_shift) {
        return res.status(400).json({ message: "Cán bộ thư viện cần cung cấp position và work_shift" });
      }
      processedExtraInfo = { position, work_shift };
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      password_hash: hashedPassword,
      role,
      user_id,
      extra_info: processedExtraInfo,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký người dùng thành công", user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error: error.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Update a user
router.put("/users/:user_id", authenticateToken, async (req, res) => {
  try {
    // Kiểm tra xem người dùng có phải là nhân viên thư viện không
    if (req.user.role !== "library_staff") {
      return res.status(403).json({ message: "Forbidden: Bạn không có quyền truy cập" });
    }

    // Xác thực user_id
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ message: "User ID là bắt buộc" });
    }

    // Cập nhật người dùng
    const updatedUser = await User.findOneAndUpdate({ user_id }, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ message: "Cập nhật người dùng thành công", user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error: error.message });
  }
});
// Delete a user
router.delete("/users/:user_id", authenticateToken, async (req, res) => {
  try {
    // Kiểm tra xem người dùng có phải là nhân viên thư viện không
    if (req.user.role !== "library_staff") {
      return res.status(403).json({ message: "Cấm truy cập: Bạn không có quyền thực hiện thao tác này" });
    }

    // Log giá trị user_id
    console.log("User ID nhận được:", req.params.user_id);

    // Xóa người dùng
    const deletedUser = await User.findOneAndDelete({ user_id: req.params.user_id });
    if (!deletedUser) {
      console.error("Không tìm thấy người dùng với user_id:", req.params.user_id);
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Xóa người dùng thành công", user: deletedUser });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error: error.message });
  }
});

module.exports = router;