const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { jwt_tokens, refresh_tokens } = require("../models/Token");


describe("POST /api/login - User Login", () => {

  beforeAll(async () => {
    await mongoose.connect("mongodb+srv://sydungvuong:Giganzero5@cluster0.cdtnpuj.mongodb.net/LibraryBooks", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.deleteMany({});
    await jwt_tokens.deleteMany({});
    await refresh_tokens.deleteMany({});

    const password = await bcrypt.hash("correctpassword", 10);
    await User.create({
      name: "Test User",
      email: "testlogin@example.com",
      password_hash: password,
      role: "student",
      user_id: "loginuser001",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await jwt_tokens.deleteMany({});
    await refresh_tokens.deleteMany({});
    await mongoose.connection.close();
  });

  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "testlogin@example.com",
        password_hash: "correctpassword",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body).toHaveProperty("message", "Login successful");
  });

  it("should return 400 for invalid password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "testlogin@example.com",
        password_hash: "wrongpassword",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should return 400 for non-existent email", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        email: "notfound@example.com",
        password_hash: "anyPassword",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "testlogin@example.com" }); // ❌ Missing password
  
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Email and password are required");
  });
  

  it("should return 500 if server throws unexpected error", async () => {
    // Fake the findOne to simulate DB error
    jest.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("Unexpected DB error");
    });

    const res = await request(app)
      .post("/api/login")
      .send({
        email: "testlogin@example.com",
        password_hash: "correctpassword",
      });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal server error");

    jest.restoreAllMocks();
  });
});

