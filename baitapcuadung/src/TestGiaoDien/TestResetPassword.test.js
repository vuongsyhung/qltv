import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPasswordForm from '../QuanLyNguoiDung/ResetPasswordForm'; // Đổi đường dẫn nếu bạn để file ở chỗ khác
import '@testing-library/jest-dom';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('ResetPasswordForm', () => {
  test('renders email and password inputs', () => {
    render(<ResetPasswordForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mật khẩu mới/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Đặt lại mật khẩu/i })).toBeInTheDocument();
  });

  test('displays success message on successful reset', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    render(<ResetPasswordForm />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), { target: { value: 'newpassword123' } });

    fireEvent.click(screen.getByRole('button', { name: /Đặt lại mật khẩu/i }));

    await waitFor(() => {
      expect(screen.getByText(/Mật khẩu đã được đặt lại thành công!/i)).toBeInTheDocument();
    });
  });

  test('displays error message on failed reset', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email không tồn tại' }),
    });

    render(<ResetPasswordForm />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'fail@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /Đặt lại mật khẩu/i }));

    await waitFor(() => {
      expect(screen.getByText(/Đặt lại mật khẩu thất bại/i)).toBeInTheDocument();
    });
  });

  test('clears inputs when Hủy is clicked', () => {
    render(<ResetPasswordForm />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), { target: { value: 'abc123' } });

    fireEvent.click(screen.getByRole('button', { name: /Hủy/i }));

    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Mật khẩu mới/i)).toHaveValue('');
  });

  test('disables button while loading', async () => {
    let resolveFetch;
    fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveFetch = resolve; }));

    render(<ResetPasswordForm />);
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'loading@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu mới/i), { target: { value: '12345678' } });

    fireEvent.click(screen.getByRole('button', { name: /Đặt lại mật khẩu/i }));

    expect(screen.getByRole('button', { name: /Đang xử lý.../i })).toBeDisabled();

    // Resolve fetch to end loading
    resolveFetch({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Đặt lại mật khẩu/i })).toBeEnabled();
    });
  });
});

