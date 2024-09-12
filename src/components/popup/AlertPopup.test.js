import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertPopup from './AlertPopup';

describe('AlertPopup Component', () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Popup with default props', () => {
        render(<AlertPopup isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    
        expect(screen.getByText('Warning!')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    test('renders with custom title, message, and button text', () => {
        render(
          <AlertPopup
            isOpen={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
            title="Custom Title"
            message="Custom Message"
            btnText="Custom Confirm"
          />
        );
    
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
        expect(screen.getByText('Custom Message')).toBeInTheDocument();
        expect(screen.getByText('Custom Confirm')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    test('calls onConfirm(true) and onClose when confirm button is clicked', () => {
        render(<AlertPopup isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    
        const confirmButton = screen.getByText('Confirm');
        userEvent.click(confirmButton);
    
        expect(mockOnConfirm).toHaveBeenCalledWith(true);
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls onConfirm(false) and onClose when close button is clicked', () => {
        render(<AlertPopup isOpen={true} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
    
        const closeButton = screen.getByText('Close');
        userEvent.click(closeButton);
    
        expect(mockOnConfirm).toHaveBeenCalledWith(false);
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('does not render when isOpen is false', () => {
        render(<AlertPopup isOpen={false} onClose={mockOnClose} onConfirm={mockOnConfirm} />);
        
        const popup = screen.queryByTestId('popup');
        expect(popup).toBeNull();
    });

})