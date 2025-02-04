import React, { useEffect, useState } from 'react'

// Components
import Popup from './Popup';
import Button from '../button/Button';
import Select from '../form/select/Select';
import TimePicker from '../form/time/TimePicker';
import DatePicker from '../form/date/DatePicker';

// Functions
import { validateNotEmpty } from '../../libs/utils';


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

        let returnTimePopup = '';

        if (issuance?.expectedReturnTime) {
            if (issuance?.issuanceType === 'In house') {
                returnTimePopup = new Date(issuance?.expectedReturnTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            } else if (issuance?.issuanceType === 'Take away') {
                returnTimePopup = new Date(issuance?.expectedReturnTime).toLocaleDateString('en-CA');
            }
        }

        setIssuanceData({
            id: issuance?.id || '',
            user: issuance?.user || '',
            book: issuance?.book || '',
            issueTime: issuance?.issueTime || '',
            returnTime: returnTimePopup,
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
        const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        
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
        } else if (issuanceData.issuanceType === 'In house' && issuanceData.returnTime < time) {
            newErrors.returnTime = `Return time can't be before than current time`
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
            } else {
                issuanceData.returnTime = issuance?.expectedReturnTime;
            }

            onEdit(issuanceData);
            closePopup();
        }
    }

    return (
        <Popup isOpen={isPopupOpen} title={title} onClose={closePopup} >
            <Select label={'Status'} name={'status'} value={issuanceData.status} onChange={(e) => handleChange(e)} placeholder={'Select status'} error={errors.status} >
                <option value="Issued">Issued</option>
                <option value="Returned">Returned</option>
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