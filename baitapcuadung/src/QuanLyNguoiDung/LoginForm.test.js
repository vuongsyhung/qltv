import { render, screen } from '@testing-library/react';
import LoginForm from './LoginForm';

test('renders login form', () => {
    render(<LoginForm />);
    const linkElement = screen.getByText(/login/i);
    expect(linkElement).toBeInTheDocument();
});

test('submits the form', () => {
    render(<LoginForm />);
    const inputElement = screen.getByLabelText(/username/i);
    const buttonElement = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(inputElement, { target: { value: 'testuser' } });
    fireEvent.click(buttonElement);
    
    expect(inputElement.value).toBe('testuser');
});