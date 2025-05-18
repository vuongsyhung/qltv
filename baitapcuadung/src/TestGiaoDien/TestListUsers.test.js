import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListUsers from '../QuanLyNguoiDung/ListUsers';

// Mock react-toastify to avoid rendering actual toasts in tests
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
  ToastContainer: () => <div />,
}));

describe('ListUsers', () => {
  const mockUsers = [
    {
      user_id: '1',
      name: 'User One',
      email: 'user1@example.com',
      role: 'student',
      created_at: new Date().toISOString(),
      status: 'active',
      extra_info: { khoa: 'CNTT', year: '2023' },
    },
    {
      user_id: '2',
      name: 'User Two',
      email: 'user2@example.com',
      role: 'teacher',
      created_at: new Date().toISOString(),
      status: 'inactive',
      extra_info: {},
    },
  ];

  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    });
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders user table and data', async () => {
    render(<ListUsers />);
    expect(await screen.findByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('student')).toBeInTheDocument();
    expect(screen.getByText('teacher')).toBeInTheDocument();
  });

  it('can enter edit mode and update user', async () => {
    render(<ListUsers />);
    // Wait for data to load
    await screen.findByText('User One');
    fireEvent.click(screen.getAllByTestId('edit-button')[0]);
    const nameInput = screen.getByTestId('name_1');
    fireEvent.change(nameInput, { target: { value: 'User One Edited' } });

    // Mock PUT response
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Cập nhật thành công' }),
    });

    fireEvent.click(screen.getByTestId('save-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('name_1')).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('User One Edited')).toBeInTheDocument();
    });
  });

  it('can cancel editing', async () => {
    render(<ListUsers />);
    await screen.findByText('User One');
    fireEvent.click(screen.getAllByTestId('edit-button')[0]);
    expect(screen.getByTestId('name_1')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(screen.queryByTestId('name_1')).not.toBeInTheDocument();
    expect(screen.getByText('User One')).toBeInTheDocument();
  });

  it('can delete a user', async () => {
    render(<ListUsers />);
    await screen.findByText('User One');
    // Mock DELETE response
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Xóa thành công' }),
    });
    fireEvent.click(screen.getAllByTestId('delete-button')[0]);
    await waitFor(() => {
      expect(screen.queryByText('User One')).not.toBeInTheDocument();
    });
  });
});