import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const loginData = { email, password_hash: password };

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Đăng nhập thành công!');
        console.log('Access Token:', result.accessToken);
        console.log('Refresh Token:', result.refreshToken);

        // Lưu token vào localStorage
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);

        setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
      } else {
        const errorData = await response.json();
        setMessage(`Đăng nhập thất bại: ${errorData.message}`);
        console.error('Đăng nhập thất bại:', errorData.message);
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.');
      console.error('Lỗi trong quá trình đăng nhập:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    setIsLoggedIn(false); // Cập nhật trạng thái đăng xuất
    setMessage('Bạn đã đăng xuất.');
  };

  return (
    <div className="loginform-container">
      {!isLoggedIn ? (
        <form onSubmit={handleSubmit} className="loginform">
          <div className="loginform-title">Đăng Nhập</div>
          <div className="input-group">
            <label htmlFor="email" className="label">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="label">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          <button type="submit" disabled={isLoading} className="loginbutton">
            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
          {message && <p className="message">{message}</p>}
        </form>
      ) : (
        <div className="welcome-container">
          <p>Chào mừng bạn đã đăng nhập!</p>
          <button onClick={handleLogout} className="button">Đăng Xuất</button>
          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
