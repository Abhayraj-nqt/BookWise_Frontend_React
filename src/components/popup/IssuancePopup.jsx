import React, { useEffect, useState } from 'react'
import Popup from './Popup';
import Button from '../button/Button';
import Select from '../form/select/Select';
import { validateNotEmpty } from '../../libs/utils';
import TimePicker from '../form/time/TimePicker';
import DatePicker from '../form/date/DatePicker';


const initalErrors = {
    status: '',
    issuanceType: '',
    returnTime: '',
}

const IssuancePopup = ({title, isPopupOpen, closePopup, issuance, onEdit, onAdd, type='add'}) => {

    const [issuanceData, setIssuanceData] = useState({
        id: '',
        user: '',
        book: '',
        issueTime: '',
        returnTime: '',
        status: '',
        issuanceType: '',
    })

    const [currentTime] = useState(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    );
    const [isReturnTimeChanged, setIsReturnTimeChanged] = useState(false);

    const [errors, setErrors] = useState(initalErrors);

    useEffect(() => {
        setIssuanceData({
            id: issuance?.id || '',
            user: issuance?.user || '',
            book: issuance?.book || '',
            issueTime: issuance?.issueTime || '',
            returnTime: issuance?.expectedReturnTime || '',
            status: issuance?.status || '',
            issuanceType: issuance?.issuanceType || '',
        })
    }, [issuance])

    useEffect(() => {
        if (isPopupOpen === false) {
            setIssuanceData({
                id: '',
                user: '',
                book: '',
                issueTime: '',
                returnTime: '',
                status: '',
                issuanceType: '',
            })

            setIsReturnTimeChanged(false);
            setErrors(initalErrors);
        }
    }, [isPopupOpen])

    const handleChange = (e) => {
        setErrors(initalErrors);
        setIssuanceData({ ...issuanceData, [e.target.name]: e.target.value });

        if (e.target.name === 'returnTime') {
            setIsReturnTimeChanged(true);
        }
    }

    const validateIssuance = () => {
        let isValid = true;
        const newErrors = {
            status: '',
            issuanceType: '',
            returnTime: '',
        }

        if (!validateNotEmpty(issuanceData.status)) {
            newErrors.status = `Status is required!`;
            isValid = false;
        }

        if (!validateNotEmpty(issuanceData.issuanceType)) {
            newErrors.issuanceType = 'Issuance type is required!'
            isValid = false;
        }

        if (!validateNotEmpty(issuanceData.returnTime)) {
            newErrors.returnTime = 'Return time is required!'
            isValid = false;
        }

        if (!isValid) {
            setErrors(newErrors);
        }

        return isValid;
    }

    const handleAdd = () => {
        if (validateIssuance()) {
            onAdd(issuanceData);
            // closePopup();
        }
    }

    const handleEdit = () => {
        if (validateIssuance()) {

            if (isReturnTimeChanged) {
                let formatedDateTime = '';
                const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

                const currentDate = new Date().toLocaleDateString('en-CA');

                if (issuanceData.issuanceType === 'In house') {
                    formatedDateTime = `${currentDate}T${issuanceData.returnTime}:00`
                } else {
                    formatedDateTime = `${issuanceData.returnTime}T${currentTime}`;
                }

                issuanceData.returnTime = formatedDateTime;
            }

            onEdit(issuanceData);
            closePopup();
        }
    }

    return (
        <Popup isOpen={isPopupOpen} title={title} onClose={closePopup} >
            {/* <Input type={'text'} value={bookData.title} name={'title'} onChange={(e) => handleChange(e)} label={'Title'} placeholder={'Enter book title'} />
            <Input type={'text'} value={bookData.author} name={'author'} onChange={(e) => handleChange(e)} label={'Author'} placeholder={'Enter author name'} />
            <Input type={'number'} value={bookData.avlQty} name={'avlQty'} onChange={(e) => handleChange(e)} label={'Quantity'} placeholder={'Enter book quantity'} /> */}
            <Select label={'Status'} name={'status'} value={issuanceData.status} onChange={(e) => handleChange(e)} placeholder={'Select status'} error={errors.status} >
                {/* <option value="">Select</option> */}
                <option value="Issued">Issued</option>
                <option value="Returned">Returned</option>
            </Select>
            <Select label={'Type'} name={'issuanceType'} value={issuanceData.issuanceType} onChange={(e) => handleChange(e)} placeholder={'Select issuance typr'} error={errors.issuanceType} >
                {/* <option value="">Select</option> */}
                <option value="In house">In house</option>
                <option value="Take away">Take away</option>
            </Select>
            {issuanceData.issuanceType === 'In house' && <TimePicker label={'Return time'} name='returnTime' value={issuanceData.returnTime} onChange={handleChange} placeholder={'Select time'} className={''} min={currentTime} error={errors.returnTime} />}
            {issuanceData.issuanceType === 'Take away' && <DatePicker label={'Return date'} name='returnTime' value={issuanceData.returnTime} onChange={handleChange} placeholder={'Select date'} className={''} min={new Date().toISOString().split("T")[0]} error={errors.returnTime} />}

            <div className="issuance-update-btn">
                {
                    type === 'edit' ?
                        <Button onClick={() => handleEdit()} varient={'primary'} >Update</Button> :
                        <Button onClick={() => handleAdd()} varient={'primary'} >Add</Button>
                }
            </div>
        </Popup>
    )
}

export default IssuancePopup