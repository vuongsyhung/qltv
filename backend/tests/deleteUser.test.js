const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");

// Mock middleware
jest.mock("../middleware/checktoken", () => jest.fn());
const authenticateToken = require("../middleware/checktoken");

describe("DELETE /api/users/:user_id - Delete User Endpoint", () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect("mongodb+srv://sydungvuong:Giganzero5@cluster0.cdtnpuj.mongodb.net/LibraryBooks", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany({});

    const staffUser = await User.create({
      name: "Library Staff",
      email: `librarystaff${Date.now()}@example.com`,
      password_hash: "hashed_password",
      role: "library_staff",
      user_id: "staff001",
    });

    const targetUser = await User.create({
      name: "User To Delete",
      email: `todelete${Date.now()}@example.com`,
      password_hash: "hashed_password",
      role: "student",
      user_id: "userToDelete",
    });

    token = "mocked-token";
    userId = targetUser.user_id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should delete a user successfully when requested by library_staff", async () => {
    authenticateToken.mockImplementationOnce((req, res, next) => {
      req.user = { role: "library_staff" };
      next();
    });

    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Xóa người dùng thành công");
    expect(res.body.user).toHaveProperty("user_id", userId);
  });

  it("should return 403 if the requester is not library_staff", async () => {
    // Tạo user khác để test lại
    const anotherUser = await User.create({
      name: "Student",
      email: `student${Date.now()}@example.com`,
      password_hash: "hashed_password",
      role: "student",
      user_id: "student123",
    });

    authenticateToken.mockImplementationOnce((req, res, next) => {
      req.user = { role: "student" };
      next();
    });

    const res = await request(app)
      .delete(`/api/users/${anotherUser.user_id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Cấm truy cập: Bạn không có quyền thực hiện thao tác này");
  });

  it("should return 404 if the user does not exist", async () => {
    authenticateToken.mockImplementationOnce((req, res, next) => {
      req.user = { role: "library_staff" };
      next();
    });

    const res = await request(app)
      .delete(`/api/users/nonexistent123`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Không tìm thấy người dùng");
  });

  it("should return 500 if there is a server error", async () => {
    authenticateToken.mockImplementationOnce((req, res, next) => {
      req.user = { role: "library_staff" };
      next();
    });

    jest.spyOn(User, "findOneAndDelete").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app)
      .delete(`/api/users/fakeid`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Lỗi máy chủ nội bộ");

    jest.restoreAllMocks();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
afterAll(async () => {
  await mongoose.connection.close();
});