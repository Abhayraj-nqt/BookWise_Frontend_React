import React, { useState, useEffect } from 'react';

// CSS
import './SelectSearch.css'

// Components
import Input from '../input/Input';
import Button from '../../button/Button';

const SelectSearch = ({placeholder='"Type to search..."', label, onSearch, onSelect, options=[], setOptions, type, loading=false, clearInput=false, showBtn=true}) => {

  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDropdownOpen(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue) {
      onSearch(debouncedValue);
    } else {
      setOptions([]);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (clearInput) {
      setInputValue('');
    }
  }, [clearInput])

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (type === 'user') {
      setInputValue(option.mobileNumber);
    } else if (type === 'book') {
      setInputValue(option.title)
    }
    setIsDropdownOpen(false);
    onSelect(option);
  };

  const handleSearchClick = () => {
    setIsDropdownOpen(true);
    onSearch(debouncedValue)
  }

  return (
    <div className='select-search'>
      <div className="search-bar-with-btn">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          onClick={() => setIsDropdownOpen(true)}
          label={label}
        />

        {showBtn && <Button onClick={handleSearchClick}>Search</Button>}
      </div>

      {isDropdownOpen && options?.length > 0 &&
        <div className='search-dropdown' >
          {loading ? (
            <div style={{ padding: '0.5rem', color: 'red' }}>Loading...</div>
          ) : options.length > 0 ? (
            <ul>
              {options.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                >
                  {type === 'user' && <div className="">
                      <div className="">{option.name}</div>
                      <div className="">{option.mobileNumber}</div>
                  </div>}
                  {type === 'book' && <div className="">
                      <div className="">{option.title}</div>
                  </div>}
                </li>
              ))}
            </ul>
          ) : (
            <></>
          )}
        </div>
      }
    </div>
  );
}

export default SelectSearch;
