// Register.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../QuanLyNguoiDung/RegistrationForm.jsx'; // Đổi đường dẫn nếu cần
import '@testing-library/jest-dom';

beforeEach(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Register Component', () => {
  test('renders all common input fields', () => {
    render(<Register />);
    
    expect(screen.getByLabelText(/Tên:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mã Nhân Viên:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật Khẩu:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vai Trò:/i)).toBeInTheDocument();
  });

  test('displays student-specific fields when role is student', () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Vai Trò:/i), {
      target: { value: 'student' },
    });

    expect(screen.getByLabelText(/Khoa:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Năm:/i)).toBeInTheDocument();
  });

  test('shows alert if student department and year are missing on submit', () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Tên:/i), { target: { value: 'Nguyen Van A' } });
    fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'a@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mã Nhân Viên:/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Mật Khẩu:/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Vai Trò:/i), { target: { value: 'student' } });

    fireEvent.click(screen.getByRole('button', { name: /Đăng Ký/i }));
    expect(window.alert).toHaveBeenCalledWith('Sinh viên cần cung cấp department và year');
  });

  test('clears extra fields when switching roles', () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Vai Trò:/i), {
      target: { value: 'student' },
    });
    fireEvent.change(screen.getByLabelText(/Khoa:/i), { target: { value: 'CNTT' } });
    fireEvent.change(screen.getByLabelText(/Năm:/i), { target: { value: '2023' } });

    fireEvent.change(screen.getByLabelText(/Vai Trò:/i), {
      target: { value: 'teacher' },
    });

    expect(screen.getByLabelText(/Khoa:/i).value).toBe('');
    expect(screen.getByLabelText(/Chức Vụ:/i).value).toBe('');
  });

  test('resets form when Hủy is clicked', () => {
    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Tên:/i), { target: { value: 'Test User' } });

    fireEvent.click(screen.getByRole('button', { name: /Hủy/i }));

    expect(screen.getByLabelText(/Tên:/i).value).toBe('');
  });
});
