import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Popup from './Popup';
import userEvent from '@testing-library/user-event';

describe('Popup Component', () => {
    const titleText = 'Test Popup';
    const childrenText = 'This is popup content';
    const mockOnClose = jest.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
    });

    test('renders popup when isOpen is true', () => {
        render(
            <Popup isOpen={true} title={titleText} onClose={mockOnClose}>
                {childrenText}
            </Popup>
        );

        const popupContent = screen.getByText(childrenText);
        const popupTitle = screen.getByText(titleText);

        expect(popupContent).toBeInTheDocument();
        expect(popupTitle).toBeInTheDocument();
    });

    test('hides popup when isOpen is false', () => {
        render(
            <Popup isOpen={false} title={titleText} onClose={mockOnClose}>
                {childrenText}
            </Popup>
        );

        const popupContent = screen.queryByText(childrenText);
        const popupTitle = screen.queryByText(titleText);

        expect(popupContent).toBeNull();
        expect(popupTitle).toBeNull();
    });

    test('renders title correctly', () => {
        render(
            <Popup isOpen={true} title={titleText} onClose={mockOnClose}>
                {childrenText}
            </Popup>
        );

        const titleElement = screen.getByText(titleText);
        expect(titleElement).toBeInTheDocument();
    });

    test('calls onClose when overlay is clicked', () => {
        render(
            <Popup isOpen={true} title={titleText} onClose={mockOnClose}>
                {childrenText}
            </Popup>
        );

        const overlay = screen.getByRole('button', { name: /×/ });
        userEvent.click(overlay);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when close button is clicked', () => {
        render(
            <Popup isOpen={true} title={titleText} onClose={mockOnClose}>
                {childrenText}
            </Popup>
        );

        const closeButton = screen.getByText(/×/);
        userEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('does not call onClose when clicking inside popup content', () => {
        render(
            <Popup isOpen={true} title={titleText} onClose={mockOnClose}>
                {childrenText}
            </Popup>
        );

        const popupBody = screen.getByText(childrenText);
        fireEvent.click(popupBody);

        expect(mockOnClose).not.toHaveBeenCalled();
    });


});
