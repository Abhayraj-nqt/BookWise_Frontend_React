import React from "react";
import { render, screen } from '../../test-utils';
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe('Button component', () => {
    
    const mockOnClick = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('renders button with primary variant', () => {
        render(<Button varient="primary" className="custom-class">Primary Button</Button>);
    
        const button = screen.getByRole('button', { name: /primary button/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('button-primary');
        expect(button).toHaveClass('custom-class');
    });

    test('renders button with secondary varient', () => {
        render(<Button varient="secondary" className="custom-class">Secondary Button</Button>);

        const button = screen.getByRole('button', { name: /secondary button/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('button-secondary');
        expect(button).toHaveClass('custom-class');
    });

    test('fires onClick event when clicked', () => {
        render(<Button onClick={mockOnClick}>Click Me</Button>);
    
        const button = screen.getByRole('button', { name: /click me/i });
        userEvent.click(button);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('renders with correct type attribute', () => {
        render(<Button type="submit">Submit Button</Button>);
    
        const button = screen.getByRole('button', { name: /submit button/i });
        expect(button).toHaveAttribute('type', 'submit');
    });

    test('renders with default type="button" when no type is provided', () => {
        render(<Button>Default Button</Button>);
    
        const button = screen.getByRole('button', { name: /default button/i });
        expect(button).toHaveAttribute('type', 'button');
    });

})
