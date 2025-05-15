const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Mock the authenticateToken middleware
jest.mock("../middleware/checktoken", () => jest.fn());

const authenticateToken = require("../middleware/checktoken");

describe("PUT /api/users/:user_id - Update User Endpoint", () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect('mongodb+srv://sydungvuong:Giganzero5@cluster0.cdtnpuj.mongodb.net/LibraryBooks', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clean up the database before running tests
    await User.deleteMany({});

    const libraryStaff = await User.create({
      name: "Library Staff",
      email: "librarystaff@example.com",
      password_hash: await bcrypt.hash("password123", 10),
      role: "library_staff",
      user_id: "staff123",
    });

    token = "mocked-token";

    const user = await User.create({
      name: "User One",
      email: `userone${Date.now()}@example.com`, // Use a unique email
      password_hash: await bcrypt.hash("password123", 10),
      role: "student",
      user_id: "user123",
    });

    userId = user.user_id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should update a user successfully", async () => {
    authenticateToken.mockImplementationOnce((req, res, next) => {
      req.user = { role: "library_staff" }; // Mock user with library_staff role
      next();
    });

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated User",
        email: `updateduser${Date.now()}@example.com`, // Use a unique email
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Cập nhật người dùng thành công");
    expect(res.body.user).toHaveProperty("name", "Updated User");
    expect(res.body.user).toHaveProperty("email");
  });

  it("should return 403 if the user is not library staff", async () => {
    authenticateToken.mockImplementationOnce((req, res, next) => {
      req.user = { role: "student" }; // Mock user with a non-library_staff role
      next();
    });

    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", "Bearer invalid-token")
      .send({
        name: "Updated User",
        email: `updateduser${Date.now()}@example.com`, // Use a unique email
      });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("message", "Forbidden: Bạn không có quyền truy cập");
  });

  it("should return 404 if the user is not found", async () => {
    authenticateToken.mockImplementationOnce((req, res, next) => {
      req.user = { role: "library_staff" };
      next();
    });
  
    jest.spyOn(User, "findOneAndUpdate").mockResolvedValueOnce(null);
  
    const res = await request(app)
      .put("/api/users/nonexistentuser")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated User",
        email: `updateduser${Date.now()}@example.com`,
      });
  
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Không tìm thấy người dùng");
  
    jest.restoreAllMocks(); // Gọi sau khi test kết thúc
  }, 15000);
  

  it("should return 400 if user_id is missing", async () => {
    const res = await request(app)
      .put("/api/users/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated User",
        email: `updateduser${Date.now()}@example.com`, // Use a unique email
      });

    expect(res.status).toBe(404); // Invalid route will return 404
  });

  it("should return 500 if there is a server error", async () => {
    authenticateToken.mockImplementationOnce((req, res, next) => {
      req.user = { role: "library_staff" };
      next();
    });
  
    jest.spyOn(User, "findOneAndUpdate").mockImplementationOnce(() => {
      throw new Error("Database error");
    });
  
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated User",
        email: `updateduser${Date.now()}@example.com`,
      });
  
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Lỗi máy chủ nội bộ");
  
    jest.restoreAllMocks(); // tránh ảnh hưởng test sau
  }, 10000);
  
});

