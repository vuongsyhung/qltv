const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://sydungvuong:Giganzero5@cluster0.cdtnpuj.mongodb.net/LibraryBooks')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));




const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true , required: true},
    password_hash: { type: String, required: true },
    role: { type: String, required: true },
    user_id: { type: String },
    extra_info: mongoose.Schema.Types.Mixed,
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: "active" },
    last_login: Date,
  });
  module.exports = mongoose.model("users", UserSchema);









