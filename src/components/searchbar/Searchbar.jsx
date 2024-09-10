import React, {useEffect, useState} from 'react'
import { SearchIcon } from '../icons/Icons';
import './Searchbar.css'

const Searchbar = ({placeholder, onSearch, varient='primary', clearInput=false, icon=true}) => {

    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
      if (clearInput) {
        setSearchQuery('');
      }
    }, [clearInput])

  return (
    <div className='search-bar'>
        <input onChange={(e) => {setSearchQuery(e.target.value); onSearch(e.target.value.trim())}} className={`${varient === 'primary' ? 'bg-white' : 'bg-gray'}`} type="text" value={searchQuery} placeholder={placeholder}  />
        {icon && <div onClick={() => onSearch(searchQuery)} className="search-icon">
            <SearchIcon size={20} />
        </div>}
    </div>
  )
}

export default Searchbar