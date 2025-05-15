import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from './RegistrationForm';

// filepath: src/QuanLyNguoiDung/RegistrationForm.test.jsx

global.fetch = jest.fn();

describe('Register Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the registration form', () => {
    render(<Register />);
    expect(screen.getByText('Đăng Ký Người Dùng')).toBeInTheDocument();
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Role:')).toBeInTheDocument();
    expect(screen.getByText('Đăng Ký')).toBeInTheDocument();
  });

  test('updates input fields on change', () => {
    render(<Register />);
    const nameInput = screen.getByLabelText('Name:');
    const emailInput = screen.getByLabelText('Email:');
    const passwordInput = screen.getByLabelText('Password:');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('displays role-specific fields when a role is selected', () => {
    render(<Register />);
    const roleSelect = screen.getByLabelText('Role:');

    fireEvent.change(roleSelect, { target: { value: 'student' } });
    expect(screen.getByLabelText('Student ID:')).toBeInTheDocument();
    expect(screen.getByLabelText('Department:')).toBeInTheDocument();
    expect(screen.getByLabelText('Year:')).toBeInTheDocument();

    fireEvent.change(roleSelect, { target: { value: 'teacher' } });
    expect(screen.getByLabelText('Teacher ID:')).toBeInTheDocument();
    expect(screen.getByLabelText('Position:')).toBeInTheDocument();

    fireEvent.change(roleSelect, { target: { value: 'library_staff' } });
    expect(screen.getByLabelText('Staff ID:')).toBeInTheDocument();
    expect(screen.getByLabelText('Work Shift:')).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Registration successful' }),
    });

    render(<Register />);
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Role:'), { target: { value: 'student' } });
    fireEvent.change(screen.getByLabelText('Student ID:'), { target: { value: '12345' } });

    fireEvent.click(screen.getByText('Đăng Ký'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/register', expect.any(Object));
      expect(screen.getByText('Đăng Ký Người Dùng')).toBeInTheDocument();
    });
  });

  test('handles form submission error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Error occurred' }),
    });

    render(<Register />);
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Role:'), { target: { value: 'student' } });
    fireEvent.change(screen.getByLabelText('Student ID:'), { target: { value: '12345' } });

    fireEvent.click(screen.getByText('Đăng Ký'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/register', expect.any(Object));
      expect(screen.getByText('Đăng Ký Người Dùng')).toBeInTheDocument();
    });
  });
});