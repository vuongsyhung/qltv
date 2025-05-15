const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://sydungvuong:Giganzero5@cluster0.cdtnpuj.mongodb.net/LibraryBooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));



const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password_hash: String,
    role: String,
    user_id: String,
    extra_info: mongoose.Schema.Types.Mixed,
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: "active" },
    last_login: Date,
  });
  module.exports = mongoose.model("users", UserSchema);









