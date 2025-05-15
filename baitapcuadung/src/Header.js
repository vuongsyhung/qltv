import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Bạn đã đăng xuất!");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <h5>
        Thư Viện HUMG        
      </h5>
      <nav>
        <Link to="/users" style={styles.link}>Thông Tin Người Dùng</Link>
        <Link to="/register" style={styles.link}>Đăng Ký</Link>
        <Link to="/resetpassword" style={styles.link}>Đổi Mật Khẩu</Link>
        <Link to="/login" style={styles.link}>Đăng Nhập</Link>
        <button onClick={handleLogout} style={styles.button}>Đăng Xuất</button>
      </nav>
    </header>
  );
};

// CSS nội tuyến
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: "10px 20px",
    color: "white",
  },
  link: {
    color: "white",
    margin: "0 15px",
    textDecoration: "none",
  },
  button: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Header;