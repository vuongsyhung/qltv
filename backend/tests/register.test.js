const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("POST /api/register - User Registration Endpoint", () => {
  it("should create a new user", async () => {
    const uniqueEmail = `john${Date.now()}@example.com`; // Generate a unique email
    const res = await request(app).post("/api/register").send({
      name: "John Doe",
      email: uniqueEmail,
      password_hash: "123456",
      role: "student",
      extra_info: { department: "IT", year: 3 },
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  it("should return error for missing fields", async () => {
    const res = await request(app).post("/api/register").send({
      name: "Jane Doe",
      email: "",
      password_hash: "123456",
      role: "teacher",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Tên, email, mật khẩu và vai trò là bắt buộc");
  });

  it("should return error for invalid role", async () => {
    const res = await request(app).post("/api/register").send({
      name: "Invalid Role",
      email: "invalid@example.com",
      password_hash: "123456",
      role: "invalid_role",
      extra_info: {},
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Vai trò không hợp lệ");
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});