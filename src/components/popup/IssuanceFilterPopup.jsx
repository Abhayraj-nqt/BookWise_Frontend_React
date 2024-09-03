import React, { useEffect, useState } from 'react'
import './IssuanceFilterPopup.css'
import Popup from './Popup'
import { getAllBooks } from '../../api/services/book';
import Input from '../form/input/Input';
import Select from '../form/select/Select';
import DatePicker from '../form/date/DatePicker';
import Button from '../button/Button';
import { useSelector } from 'react-redux';

const UserHistoryFilterPopup = ({ onFilter, isOpen, onClose, title }) => {

    const auth = useSelector(state => state.auth);

    const [allBooks, setAllBooks] = useState([]);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [issueTimeFrom, setIssueTimeFrom] = useState();
    const [issueTimeTo, setIssueTimeTo] = useState();
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        loadAllBooks();
    }, [])

    const loadAllBooks = async () => {
        try {
            const data = await getAllBooks();

            if (Array.isArray(data)) {
                setAllBooks(data);
            } else {
                setAllBooks(data.content);
            }
        } catch (error) {
            console.log('Error fetching books', error);
        }
    }

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const handleSelectBooks = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedBooks([...selectedBooks, value]);
        } else {
            setSelectedBooks(selectedBooks.filter(item => item !== value));
        }
    }

    const handleFilter = () => {
        const filterObj = {

        }

        if (selectedBooks.length > 0) {
            // TODO - Create proper , seperated values
            const titles = selectedBooks.toString();

            filterObj.titles = titles;
        }

        if (issueTimeFrom) {
            filterObj.issueTimeFrom = issueTimeFrom + 'T00:00:00';
        }
        if (issueTimeTo) {
            filterObj.issueTimeTo = issueTimeTo + 'T23:59:00';
        }
        if (status) {
            filterObj.status = status;
        }
        if (type) {
            filterObj.type = type;
        }

        onFilter(filterObj);
    }

    return (
        <Popup isOpen={isOpen} title={title} onClose={onClose} >
            <div className="filter-select-books">
                <div className="" onClick={() => toggleDropdown()}>
                    <Input
                        type='text'
                        placeholder={'Select books'}
                        value={selectedBooks.toString()}
                        label={'Select books'}
                        onChange={() => {}}

                    />
                </div>
                {isDropdownOpen && allBooks?.length > 0 &&
                    <div className='book-list-dropdown' onMouseLeave={() =>  setIsDropdownOpen(false)} onMouseOver={() => setIsDropdownOpen(true)} >
                        {allBooks.map(book => <div key={book?.id} className='book-list-dropdown-item'>
                            <input type="checkbox" value={book?.title} onChange={handleSelectBooks} checked={selectedBooks.includes(book?.title)} />
                            <div className="">{book?.title}</div>
                        </div>)}
                    </div>}
            </div>

            <div className="filter-select-data">
                <DatePicker label={'Issuance from'} onChange={(e) => setIssueTimeFrom(e.target.value)} value={issueTimeFrom} />
                <DatePicker label={'Issuance to'} onChange={(e) => setIssueTimeTo(e.target.value)} value={issueTimeTo} />
            </div>

            <div className="filter-select-status">
                <Select label={'Select status'} onChange={(e) => setStatus(e.target.value)} value={status} >
                    <option value={''}>All</option>
                    <option value={'Issued'}>Issued</option>
                    <option value={'Returned'}>Returned</option>
                </Select>
            </div>

            <div className="filter-select-type">
                <Select label={'Select issuance type'} onChange={(e) => setType(e.target.value)} value={type} >
                    <option value={''}>All</option>
                    <option value={'In house'}>In house</option>
                    <option value={'Take away'}>Take away</option>
                </Select>
            </div>

            <div className="filter-btn">
                <Button varient='primary' onClick={handleFilter}>Filter</Button>
            </div>

        </Popup>
    )
}

export default UserHistoryFilterPopup