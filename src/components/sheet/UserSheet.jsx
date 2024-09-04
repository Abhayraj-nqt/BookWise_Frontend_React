import React, { useEffect, useState } from 'react'
import Sheet from './Sheet'
import { getAllBooks, getBookByTitle } from '../../api/services/book';
import { useSelector } from 'react-redux';
import Searchbar from '../searchbar/Searchbar';
import Button from '../button/Button';

import './UserSheet.css'
import toast from '../toast/toast';
import Select from '../form/select/Select';
import { createIssuance } from '../../api/services/Issuance';
import TimePicker from '../form/time/TimePicker';
import DatePicker from '../form/date/DatePicker';
import SelectSearch from '../form/selectSearch/SelectSearch';
import { validateNotEmpty } from '../../libs/utils';

const initialErrors = {
    returnTime: ''
}

const UserSheet = ({ isSheetOpen, onClose, userData }) => {

    const auth = useSelector(state => state.auth);

    const [bookData, setBookData] = useState({
        id: '',
        title: '',
        author: '',
        category: {
            id: '',
            name: '',
        },
        avlQty: '',
    })

    const [currentTime] = useState(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    );

    const [query, setQuery] = useState('');
    const [clearInput, setClearInput] = useState(false);
    const [issuanceType, setIssuanceType] = useState('In house');
    const [returnTime, setReturnTime] = useState('');
    const [errors, setErrors] = useState(initialErrors);
    const [search, setSearch] = useState('');
    const [clearSheetInput, setClearSheetInput] = useState(false);
    const [bookList, setBookList] = useState([]);

    useEffect(() => {
        if (!isSheetOpen) {
            setBookData({
                id: '',
                title: '',
                author: '',
                category: {
                    id: '',
                    name: '',
                },
                avlQty: '',
            })
            setQuery('');
            setClearInput(true);
            setClearSheetInput(true);
            setErrors(initialErrors);
        } else {
            setClearInput(false);
            setClearSheetInput(false);
        }
    }, [isSheetOpen])

    const handleSearch = async (searchQuery) => {
        // setQuery(searchQuery);
        setSearch(searchQuery);
        await loadBooks();
    }

    const handleBookIssue = async () => {

        if (!validate()) {
            return;
        }

        let formatedDateTime = '';
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

        const currentDate = new Date().toLocaleDateString('en-CA');

        if (issuanceType === 'In house') {
            formatedDateTime = `${currentDate}T${returnTime}:00`
        } else {
            formatedDateTime = `${returnTime}T${currentTime}`;
        }

        console.log({ "user mobile": userData?.id, "book id": bookData?.id, issuanceType });
        const issenceObj = {
            user: userData?.id,
            book: bookData?.id,
            issuanceType: issuanceType,
            returnTime: formatedDateTime,
        }

        try {
            const {data} = await createIssuance(issenceObj, auth.token);
            console.log('ISSUANCE', data);
            toast.success(data?.message || 'Issuance created successfully');
        } catch (error) {
            const msg = error.response.data.message || 'Failed to create issuance';
            console.log(error);
            toast.error(msg);
        }

        onClose();
    }

    const validate = () => {
        let isValid = true;
        const newErrors = {
            returnTime: ''
        }

        if (!validateNotEmpty(returnTime)) {
            newErrors.returnTime = `Return time is required!`
            isValid = false;
        }

        if (!isValid) {
            setErrors(newErrors);
        }

        return isValid;
    }

    const loadBooks = async () => {
        try {
            const data = await getAllBooks({page:0, size: 10, sortBy: 'title', sortDir: 'asc', search: search})
            if (Array.isArray(data)) {
                setBookList(data)
            } else {
                setBookList(data?.content);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelect = (selectedBook) => {
        setBookData(selectedBook);
    }

    return (
        <Sheet isOpen={isSheetOpen} onClose={onClose}>
            <div className="user-sheet">
                <h2>Issue book to user</h2>
                <div className="sheet-serch-bar">
                    {/* <Searchbar placeholder={'Search book by title'} onSearch={handleSearch} varient={'secondary'} clearInput={clearInput} icon={false} /> */}
                    <SelectSearch  options={bookList} setOptions={setBookList} onSearch={handleSearch} placeholder='Enter book title' onSelect={handleSelect} clearInput={clearSheetInput} type={'book'} />
                    {/* <Button onClick={handleClickSearch} varient={'primary'}>Search</Button> */}
                </div>
                <div className="">
                    <Select label={'Type'} name={'issuanceType'} value={issuanceType} onChange={(e) => setIssuanceType(e.target.value)} placeholder={'Select issuance typr'} >
                        <option value="In house">In house</option>
                        <option value="Take away">Take away</option>
                    </Select>
                    {issuanceType === 'In house' && <TimePicker label={'Return time'} name='returnTime' value={returnTime} onChange={(e) => {setReturnTime(e.target.value); setErrors(initialErrors)}} placeholder={'Select time'} className={''} min={currentTime} error={errors.returnTime} />}
                    {issuanceType === 'Take away' && <DatePicker label={'Return date'} name='returnTime' value={returnTime} onChange={(e) => {setReturnTime(e.target.value); setErrors(initialErrors)}} placeholder={'Select date'} className={''} min={new Date().toISOString().split("T")[0]} error={errors.returnTime} />}
                </div>

                {userData && userData.mobileNumber &&
                    <div className='user-details-container'>
                        <div className="user-id uder-detail-row">
                            <div className='user-label'>Id: </div>
                            <div>{userData.id}</div>
                        </div>
                        <div className="user-name uder-detail-row">
                            <div className='user-label'>Name: </div>
                            <div>{userData.name}</div>
                        </div>
                        <div className="user-mobile uder-detail-row">
                            <div className='user-label'>Mobile: </div>
                            <div>{userData.mobileNumber}</div>
                        </div>
                        <div className="user-email uder-detail-row">
                            <div className='user-label'>Email: </div>
                            <div>{userData.email}</div>
                        </div>
                    </div>}

                {bookData && bookData?.id &&
                    <div className='user-details-container'>
                        <div className="uder-detail-row">
                            <div className='user-label'>Id: </div>
                            <div>{bookData?.id}</div>
                        </div>
                        <div className="uder-detail-row">
                            <div className='user-label'>Title: </div>
                            <div>{bookData?.title}</div>
                        </div>
                        <div className="uder-detail-row">
                            <div className='user-label'>Author: </div>
                            <div>{bookData?.author}</div>
                        </div>
                        <div className="uder-detail-row">
                            <div className='user-label'>Category: </div>
                            <div>{bookData?.category?.name}</div>
                        </div>
                        <div className="uder-detail-row">
                            <div className='user-label'>Avl. Qty: </div>
                            <div>{bookData?.avlQty}</div>
                        </div>
                    </div>}

                {bookData && bookData?.id &&
                    <div className="user-sheet-issue-btn">
                        <Button onClick={handleBookIssue} varient={'primary'}>Issue</Button>
                    </div>
                }

            </div>
        </Sheet>
    )
}

export default UserSheet