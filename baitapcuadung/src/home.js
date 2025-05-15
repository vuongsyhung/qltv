import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token đăng nhập
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Bạn đã đăng xuất!");
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  return (
    <div style={styles.body}>      
      {/* Nội dung trang */}
      <main style={styles.main}>
        <h1>Chào mừng bạn đến với Thư Viện HUMG!</h1>
        <p>Hãy đăng nhập hoặc đăng ký để sử dụng dịch vụ!</p>
      </main>
    </div>
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
  main: {
    padding: "20px",
    textAlign: "center",
  },
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
    color: "#007bff",}  
};

export default Home;