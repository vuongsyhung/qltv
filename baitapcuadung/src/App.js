import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import Header from "./Header";
import ListUsers from "./QuanLyNguoiDung/ListUsers";
import LoginForm from "./QuanLyNguoiDung/LoginForm";
import RegistrationForm from "./QuanLyNguoiDung/RegistrationForm";
import ResetPasswordForm from "./QuanLyNguoiDung/ResetPasswordForm";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<ListUsers />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/resetpassword" element={<ResetPasswordForm />} />
      </Routes>
    </Router>
  );
}

export default App;



// import logo from './logo.svg';
// import React from 'react';
// import './App.css';
// import ResetPasswordForm from './QuanLyNguoiDung/ResetPasswordForm';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h3>Đặt lại mật khẩu</h3>
//         <ResetPasswordForm />
//       </header>
//     </div>
//   );
// }

// export default App;


// import logo from './logo.svg';
// import React from 'react';
// import './App.css';
// import LoginForm from './QuanLyNguoiDung/LoginForm';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h3>Đăng Nhập</h3>
//         <LoginForm />
//       </header>
//     </div>
//   );
// }

// export default App;




// import logo from './logo.svg';
// import React from 'react';
// import './App.css';
// import RegistrationForm from './QuanLyNguoiDung/RegistrationForm'; 

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h3>Đăng Ký Sử Dụng Thư Viện</h3>
//         <RegistrationForm />
//       </header>
//     </div>
//   );
// }

// export default App;