import React, { useState } from 'react';
import './ResetPasswordForm.css';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const resetData = { email, newPassword };

    try {
      const response = await fetch('http://localhost:3000/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Mật khẩu đã được đặt lại thành công!');
        console.log('Reset password successful:', result);
      } else {
        const errorData = await response.json();
        setMessage(`Đặt lại mật khẩu thất bại: ${errorData.message}`);
        console.error('Reset password failed:', errorData.message);
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra trong quá trình đặt lại mật khẩu. Vui lòng thử lại.');
      console.error('Error during password reset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setNewPassword('');
    setMessage('');
  };

  return (
    <div className="resetdiv">
      <form onSubmit={handleSubmit} className="resetform">
        <div className="formtitle">Thay Đổi Mật Khẩu</div>
        <div>
          <label htmlFor="reset-email">Email:</label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="new-password">Mật khẩu mới:</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" disabled={isLoading} className="button">
            {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
          <button type="button" onClick={handleReset} className="button cancel-button">
            Hủy
          </button>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPasswordForm;
