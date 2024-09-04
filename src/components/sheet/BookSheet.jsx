import React, { useEffect, useState } from 'react'
import Sheet from './Sheet'
import Searchbar from '../searchbar/Searchbar'
import Card from '../card/Card'
import { getAllUsers, getUserByMobile } from '../../api/services/user'
import toast from '../toast/toast'
import { useSelector } from 'react-redux'
import Button from '../button/Button'

import './BookSheet.css'
import Select from '../form/select/Select'
import Input from '../form/input/Input'
import { createIssuance } from '../../api/services/Issuance'
import TimePicker from '../form/time/TimePicker'
import DatePicker  from '../form/date/DatePicker'
import { validateNotEmpty } from '../../libs/utils'
import SelectSearch from '../form/selectSearch/SelectSearch'

const initialErrors = {
    returnTime: ''
}

const BookSheet = ({ isSheetOpen, onClose, bookData }) => {

    const auth = useSelector(state => state.auth);

    const [userData, setUserData] = useState({
        id: '',
        name: '',
        mobileNumber: '',
        email: '',
    })

    const [currentTime] = useState(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    );

    const [query, setQuery] = useState('');
    const [clearInput, setClearInput] = useState(false);
    const [issuanceType, setIssuanceType] = useState('In house');
    const [returnTime, setReturnTme] = useState('');
    const [errors, setErrors] = useState(initialErrors);
    const [search, setSearch] = useState('');
    const [userList, setUserList] = useState([]);
    const [clearSheetInput, setClearSheetInput] = useState(false);

    useEffect(() => {
        if(!isSheetOpen) {
            setUserData({
                id: '',
                name: '',
                mobileNumber: '',
                email: '',
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
        await loadUsers()
    }

    const handleSelect = (selectedUser) => {
        setUserData(selectedUser);
    }

    const handleClickSearch = async () => {
        try {
            const data = await getUserByMobile(query);
            setUserData(data);
        } catch (error) {
            console.log(error);
            toast.error(`Failed to find user`);
        }
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

        console.log({ "user mobile": userData?.id, "book id": bookData?.id, issuanceType, formatedDateTime });
        const issenceObj = {
            user: userData?.id,
            book: bookData?.id,
            issuanceType: issuanceType,
            returnTime: formatedDateTime,
        }

        try {
            const data = await createIssuance(issenceObj);
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

    const loadUsers = async () => {
        try {
            const data = await getAllUsers({page: 0, size: 10, sortBy: 'mobileNumber', sortDir: 'asc', search: search})
            if (Array.isArray(data)) {
                setUserList(data)
            } else {
                setUserList(data?.content);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Sheet isOpen={isSheetOpen} onClose={onClose}>
            <div className="book-sheet">
                <h2>Issue book to user</h2>
                <div className="sheet-serch-bar">
                    {/* <Searchbar placeholder={'Search user by mobile no.'} onSearch={handleSearch} varient={'secondary'} clearInput={clearInput} icon={false} /> */}
                    <SelectSearch  options={userList} setOptions={setUserList} onSearch={handleSearch} placeholder='Enter mobile no.' onSelect={handleSelect} clearInput={clearSheetInput} type={'user'} />
                    {/* <Button onClick={handleClickSearch} varient={'primary'}>Search</Button> */}
                </div>
                <div className="">
                    <Select label={'Type'} name={'issuanceType'} value={issuanceType} onChange={(e) => setIssuanceType(e.target.value)} placeholder={'Select issuance type'} >
                        <option value="In house">In house</option>
                        <option value="Take away">Take away</option>
                    </Select>
                    {/* <Input label={'Return date'} onChange={(e) => setReturnDate(e.target.value)} name='returnDate' value={returnDate} type='datetime-local' placeholder={'Select date'}  /> */}
                    {issuanceType === 'In house' && <TimePicker label={'Return time'} name='returnTime' value={returnTime} onChange={(e) => {setReturnTme(e.target.value); setErrors(initialErrors)}} placeholder={'Select time'} className={''} min={currentTime} error={errors.returnTime} />}
                    {issuanceType === 'Take away' && <DatePicker label={'Return date'} name='returnTime' value={returnTime} onChange={(e) => {setReturnTme(e.target.value); setErrors(initialErrors)}} placeholder={'Select date'} className={''} min={new Date().toISOString().split("T")[0]} error={errors.returnTime} />}
                </div>

                {bookData && 
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

                {userData && userData.mobileNumber && 
                    <div className="book-sheet-issue-btn">
                        <Button onClick={handleBookIssue} varient={'primary'}>Issue</Button>
                    </div>
                }

            </div>
        </Sheet>
    )
}

export default BookSheet