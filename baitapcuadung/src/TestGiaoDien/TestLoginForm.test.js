import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../QuanLyNguoiDung/LoginForm';
import '@testing-library/jest-dom';

// Mock fetch để tránh gọi API thật
global.fetch = jest.fn();

describe('LoginForm Component', () => {
  beforeEach(() => {
    // Reset mock trước mỗi test
    fetch.mockClear();
    localStorage.clear();
  });

  const mockFetchResponse = (ok, data) => {
    fetch.mockResolvedValueOnce({
      ok,
      json: async () => data,
    });
  };

  it('renders login form with email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
  });

  it('shows loading state when form is submitted', async () => {
    render(<LoginForm />);
    mockFetchResponse(true, { accessToken: 'access-token', refreshToken: 'refresh-token' });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Kiểm tra trạng thái loading trước khi fetch hoàn thành
    expect(screen.getByRole('button', { name: /đang đăng nhập/i })).toBeInTheDocument();

    // Đợi fetch hoàn thành
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Kiểm tra đăng nhập thành công
    expect(await screen.findByText(/đăng nhập thành công!/i)).toBeInTheDocument();
  });

  it('shows error message if login fails', async () => {
    render(<LoginForm />);
    mockFetchResponse(false, { message: 'Đăng nhập thất bại' });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Kiểm tra hiển thị lỗi
    expect(await screen.findByText(/đăng nhập thất bại/i)).toBeInTheDocument();
  });

  it('shows login success message and allows logout', async () => {
    render(<LoginForm />);
    mockFetchResponse(true, { accessToken: 'access-token', refreshToken: 'refresh-token' });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Kiểm tra đăng nhập thành công
    expect(await screen.findByText(/chào mừng bạn đã đăng nhập!/i)).toBeInTheDocument();
    
    // Kiểm tra lưu token vào localStorage
    expect(localStorage.getItem('accessToken')).toBe('access-token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');

    // Kiểm tra đăng xuất
fireEvent.click(screen.getByText(/đăng xuất/i));

// Chờ giao diện render lại form đăng nhập (dựa vào nút "Đăng Nhập")
expect(await screen.findByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();

    // Kiểm tra token bị xóa khỏi localStorage
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });

  it('handles network error gracefully', async () => {
    render(<LoginForm />);

    // Mock lỗi mạng
    fetch.mockRejectedValueOnce(new Error('Lỗi mạng'));

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mật khẩu/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Đợi để fetch được gọi
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Kiểm tra hiển thị lỗi mạng
    expect(await screen.findByText(/Có lỗi xảy ra trong quá trình đăng nhập/i)).toBeInTheDocument();
  });
});
