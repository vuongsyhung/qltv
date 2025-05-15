const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Lấy token từ header
  if (!token) {
    return res.status(401).json({ message: "Access token is missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Kiểm tra token hợp lệ
    req.user = decoded;
    next(); // Tiếp tục xử lý yêu cầu
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken; // Export middleware
