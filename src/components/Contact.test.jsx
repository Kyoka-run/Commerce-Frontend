import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import Contact from './Contact';

describe('Contact Component', () => {
  it('renders the contact container and form', () => {
    renderWithProviders(<Contact />);
    
    // Check if the main elements are rendered
    expect(screen.getByTestId('contact-container')).toBeInTheDocument();
    expect(screen.getByTestId('contact-form-container')).toBeInTheDocument();
    expect(screen.getByTestId('contact-heading')).toBeInTheDocument();
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
  });

  it('displays the correct heading and text', () => {
    renderWithProviders(<Contact />);
    
    expect(screen.getByTestId('contact-heading')).toHaveTextContent('Contact us');
    expect(screen.getByText('We would love to hear from you! Please fill out the form below or contact us directly')).toBeInTheDocument();
  });

  it('renders all form input fields', () => {
    renderWithProviders(<Contact />);
    
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('message-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('displays all contact information sections', () => {
    renderWithProviders(<Contact />);
    
    expect(screen.getByTestId('phone-info')).toBeInTheDocument();
    expect(screen.getByTestId('email-info')).toBeInTheDocument();
    expect(screen.getByTestId('address-info')).toBeInTheDocument();
  });

  it('shows the correct contact information', () => {
    renderWithProviders(<Contact />);
    
    expect(screen.getByTestId('phone-info')).toHaveTextContent('+4 8961 944 149');
    expect(screen.getByTestId('email-info')).toHaveTextContent('embarkxofficial@gmail.com');
    expect(screen.getByTestId('address-info')).toHaveTextContent('123 Main, Town, USA');
  });

  it('allows entering text in the form fields', () => {
    renderWithProviders(<Contact />);
    
    // Get form inputs
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    const messageInput = screen.getByTestId('message-input');
    
    // Enter text in each field
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message' } });
    
    // Check if the values are set correctly
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('This is a test message');
  });

  it('has required attributes set on form inputs', () => {
    renderWithProviders(<Contact />);
    
    expect(screen.getByTestId('name-input')).toHaveAttribute('required');
    expect(screen.getByTestId('email-input')).toHaveAttribute('required');
    expect(screen.getByTestId('message-input')).toHaveAttribute('required');
  });

  it('has proper button text for the send button', () => {
    renderWithProviders(<Contact />);
    
    const sendButton = screen.getByTestId('send-button');
    expect(sendButton).toHaveTextContent('Send Message');
  });
});