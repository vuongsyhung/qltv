const request = require("supertest");
const app = require("../app"); // Đảm bảo đường dẫn đúng với app.js của bạn
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


describe("POST /api/resetpassword", () => {

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) { // Kiểm tra xem đã kết nối chưa
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/testdb", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
    await User.deleteMany({}); // Dọn dẹp dữ liệu trước khi bắt đầu test
  });

  afterAll(async () => {
    await User.deleteMany({}); // Dọn dẹp dữ liệu sau khi kết thúc
    await mongoose.connection.close(); // Đảm bảo đóng kết nối MongoDB
  });

  it("should reset the password successfully", async () => {
    const email = "testuser@example.com";
    const oldPassword = "oldpass123";
    const newPassword = "newpass456";

    // Tạo user test
    const hashed = await bcrypt.hash(oldPassword, 10);
    await User.create({ email, password_hash: hashed, name: "Test User", role: "student" });

    // Gửi request reset password
    const res = await request(app).post("/api/resetpassword").send({
      email,
      newPassword
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Password reset successfully");

    // Kiểm tra mật khẩu đã thay đổi
    const updatedUser = await User.findOne({ email });
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password_hash);
    expect(isMatch).toBe(true);
  });

  it("should return 400 if email or newPassword is missing", async () => {
    const res = await request(app).post("/api/resetpassword").send({
      email: "missing@example.com"
      // Thiếu newPassword
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email and new password are required");
  });

  it("should return 404 if user is not found", async () => {
    const res = await request(app).post("/api/resetpassword").send({
      email: "nonexistent@example.com",
      newPassword: "somethingNew123"
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 500 on server/database error", async () => {
    // Giả lập lỗi server
    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Mocked DB error");
    });

    const res = await request(app).post("/api/resetpassword").send({
      email: "test@example.com",
      newPassword: "newpass123"
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");

    jest.restoreAllMocks();
  });
});
