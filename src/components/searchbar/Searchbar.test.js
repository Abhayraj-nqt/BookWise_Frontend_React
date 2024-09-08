import React from "react";
import { fireEvent, render, screen } from '../../test-utils';
import Searchbar from "./Searchbar";

describe('Searchbar Component', () => { 

    const placeholderText = 'Search...';
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        mockOnSearch.mockClear();
    });

    test('renders input field with correct placeholder', () => {
        render(<Searchbar placeholder={placeholderText} onSearch={mockOnSearch} />);
    
        const inputElement = screen.getByPlaceholderText(placeholderText);
        expect(inputElement).toBeInTheDocument();
    });

    test('calls onSearch function when input changes', () => {
        render(<Searchbar placeholder={placeholderText} onSearch={mockOnSearch} />);
    
        const inputElement = screen.getByPlaceholderText(placeholderText);
        fireEvent.change(inputElement, { target: { value: 'Hello' } });
        
        expect(mockOnSearch).toHaveBeenCalledWith('Hello');
    });

    test('shows search icon when icon prop is true', () => {
        render(<Searchbar placeholder={placeholderText} onSearch={mockOnSearch} icon={true} />);
    
        const iconElement = screen.getByTestId('search-icon-svg');
        expect(iconElement).toBeInTheDocument();
    });

    test('does not show search icon when icon prop is false', () => {
        render(<Searchbar placeholder={placeholderText} onSearch={mockOnSearch} icon={false} />);
    
        const iconElement = screen.queryByTestId('search-icon-svg');
        expect(iconElement).toBeNull();
    });

    test('clears input when clearInput prop is true', () => {
        const { rerender } = render(
          <Searchbar placeholder={placeholderText} onSearch={mockOnSearch} clearInput={false} />
        );
    
        const inputElement = screen.getByPlaceholderText(placeholderText);
        fireEvent.change(inputElement, { target: { value: 'Hello' } });
        expect(inputElement.value).toBe('Hello');
    
        rerender(<Searchbar placeholder={placeholderText} onSearch={mockOnSearch} clearInput={true} />);
        expect(inputElement.value).toBe('');
    });

    test('applies correct class based on varient prop', () => {
        const { rerender } = render(
          <Searchbar placeholder={placeholderText} onSearch={mockOnSearch} varient="primary" />
        );
    
        const inputElement = screen.getByPlaceholderText(placeholderText);
        expect(inputElement).toHaveClass('bg-white');
    
        rerender(<Searchbar placeholder={placeholderText} onSearch={mockOnSearch} varient="secondary" />);
        expect(inputElement).toHaveClass('bg-gray');
    });

})
