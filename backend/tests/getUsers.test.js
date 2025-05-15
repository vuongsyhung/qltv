const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");

describe("GET /api/users - Fetch All Users", () => {
  beforeAll(async () => {
    // Connect to the database and seed test data
    await mongoose.connect('mongodb+srv://sydungvuong:Giganzero5@cluster0.cdtnpuj.mongodb.net/LibraryBooks', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    
    // Seed the database with test users
    await User.create([
      { name: "User One", email: "userone@example.com", password_hash: "hashedpassword1", role: "student" },
      { name: "User Two", email: "usertwo@example.com", password_hash: "hashedpassword2", role: "teacher" },
    ]);
  });

  
  afterAll(async () => {
    // Clean up the database and close the connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });


  it("should fetch all users successfully", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2); // Ensure at least 2 users are returned
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("email");
    expect(res.body[0]).toHaveProperty("role");
  });

  it("should handle server errors gracefully", async () => {
    // Simulate a server error by mocking the User.find method
    jest.spyOn(User, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message", "Internal server error");
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
afterAll(async () => {
  await mongoose.connection.close();
});