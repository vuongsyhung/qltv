import React, { useState } from 'react';
import './RegistrationForm.css';  

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user_id: '',
    password: '',
    role: '',    
    extra_info: {},
    created_at: new Date().toISOString(),
    status: 'active',
    last_login: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      user_id: '',
      password: '',
      role: '',    
      extra_info: {},
      created_at: new Date().toISOString(),
      status: 'active',
      last_login: null,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Xử lý extra_info theo role
    let processedExtraInfo = {};
    if (formData.role === "student") {
      const { department, year } = formData;
      if (!department || !year) {
        alert("Sinh viên cần cung cấp department và year");
        return;
      }
      processedExtraInfo = { department, year };
    } else if (formData.role === "teacher") {
      const { department, position } = formData;
      if (!department || !position) {
        alert("Giáo viên cần cung cấp department và position");
        return;
      }
      processedExtraInfo = { department, position };
    } else if (formData.role === "library_staff") {
      const { position, work_shift } = formData;
      if (!position || !work_shift) {
        alert("Cán bộ thư viện cần cung cấp position và work_shift");
        return;
      }
      processedExtraInfo = { position, work_shift };
    }
  
    const payload = {
      ...formData,
      password_hash: formData.password, // Map password to password_hash
      last_login: new Date().toISOString(),
      extra_info: processedExtraInfo, // Add the dynamically prepared extra_info
    };
  
    console.log("Submitting form data:", payload);
  
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
     
      if (response.ok) {
        alert(data.message);
        // Làm trống form sau khi đăng ký thành công
        handleReset();
      } else {
        alert(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      alert('Lỗi máy chủ nội bộ');
    }
  };
  
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-title">Đăng Ký Người Dùng</div>
        <div className="input-group">
          <label className="label">Tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </div>        
        <div className="input-group">
          <label className="label">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="input-group">
          <label className="label">Mã Nhân Viên:</label>
          <input
            type="text"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="input"
          />
        </div> 
        <div className="input-group">
          <label className="label">Mật Khẩu:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="input-group">
          <label className="label">Vai Trò:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="">Chọn vai trò</option>
            <option value="student">Sinh Viên</option>
            <option value="teacher">Giáo Viên</option>
            <option value="library_staff">Nhân Viên Thư Viện</option>
          </select>
        </div>

        {formData.role && (
          <>
            {formData.role === 'student' && (
              <>               
                <div className="input-group">
                  <label className="label">Khoa:</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="input-group">
                  <label className="label">Năm:</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year || ''}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </>
            )}
            {formData.role === 'teacher' && (
              <>               
                <div className="input-group">
                  <label className="label">Khoa:</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="input-group">
                  <label className="label">Chức Vụ:</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position || ''}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </>
            )}
            {formData.role === 'library_staff' && (
              <>               
                <div className="input-group">
                  <label className="label">Chức Vụ:</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position || ''}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="input-group">
                  <label className="label">Ca Làm Việc:</label>
                  <input
                    type="text"
                    name="work_shift"
                    value={formData.work_shift || ''}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </>
            )}
          </>
        )}

<div className="button-group">
  <button type="submit" className="button">
    Đăng Ký
  </button>
  <button type="button" onClick={handleReset} className="button cancel-button">
    Hủy
  </button>
</div>
      </form>
    </div>
  );
};

export default Register;