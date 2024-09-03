import React from 'react';

// CSS
import './Pagination.css'

// Components
import { ForwardIcon, BackwardIcon } from '../icons/Icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage >= 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage+1 < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <>
      <div className="pagination">
       
        <div onClick={handlePrevious} className="pagination-icon-left icon">
          <BackwardIcon size={25} />
        </div>
        
        <span>{`Page ${currentPage+1} of ${totalPages}`}</span>
        
        <div onClick={handleNext} className="pagination-icon-right icon">
          <ForwardIcon size={25} />
        </div>
      </div> 
    </>
  );
};

export default Pagination;
