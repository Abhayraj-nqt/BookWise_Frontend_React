import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {

  const onPageChange = jest.fn();

  test('renders correctly with given props', () => {
    render(<Pagination currentPage={0} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  test('calls onPageChange with correct argument when "Previous" is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByTestId('backward-icon'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  test('calls onPageChange with correct argument when "Next" is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByTestId('forward-icon'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test('does not call onPageChange when "Previous" is clicked on the first page', () => {
    render(<Pagination currentPage={0} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByTestId('backward-icon'));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  test('does not call onPageChange when "Next" is clicked on the last page', () => {
    render(<Pagination currentPage={4} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByTestId('forward-icon'));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
