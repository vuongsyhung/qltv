const request = require("supertest");
const app = require("../app"); // Path to your Express app
const { jwt_tokens, refresh_tokens } = require("../models/Token");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

describe("POST /api/logout", () => {
  let token;
  let user;

  beforeAll(async () => {   

    // Dọn dẹp dữ liệu cũ
    await User.deleteMany({});
    await jwt_tokens.deleteMany({});

    // Tạo user test
    user = await User.create({
      name: "Test User",
      email: "logout@example.com",
      password_hash: await bcrypt.hash("password123", 10),
      role: "student",
    });

    // Tạo token & lưu vào DB
    token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    await jwt_tokens.create({
      user_id: user._id,
      role: user.role,
      token,
      issued_at: new Date(),
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: "active",
    });
  });

  afterAll(async () => {
    await jwt_tokens.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should logout successfully and mark token as revoked", async () => {
    const res = await request(app)
      .post("/api/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logout successful");

    const updated = await jwt_tokens.findOne({ token });
    expect(updated.status).toBe("revoked");
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).post("/api/logout");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Access token is missing or invalid");
  });

  it("should return 404 if token not found in DB", async () => {
    const fakeToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET);

    const res = await request(app)
      .post("/api/logout")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Token not found");
  });

  it("should return 500 if database error occurs", async () => {
    const spy = jest.spyOn(jwt_tokens, "findOne").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app)
      .post("/api/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal server error");

    spy.mockRestore();
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});