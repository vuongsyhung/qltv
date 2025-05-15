const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://sydungvuong:Giganzero5@cluster0.cdtnpuj.mongodb.net/LibraryBooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// JWT Tokens Schema
const jwtTokenSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  role: String,
  token: String,
  issued_at: { type: Date, default: Date.now },
  expires_at: Date,
  status: { type: String, default: "active" },
});

// Refresh Tokens Schema
const refreshTokenSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  refresh_token: String,
  issued_at: { type: Date, default: Date.now },
  expires_at: Date,
  used: { type: Boolean, default: false },
});

const jwt_tokens = mongoose.model("jwt_tokens", jwtTokenSchema);
const refresh_tokens = mongoose.model("refresh_tokens", refreshTokenSchema);


module.exports = { jwt_tokens, refresh_tokens }; 