import React, { useEffect, useState } from 'react'

// Components
import Popup from './Popup';
import Input from '../form/input/Input';
import Button from '../button/Button';

// Functions
import { validateAlphabet, validateEmail, validateEmailDomain, validateMobile, validateNotEmpty, validatePassword } from '../../libs/utils';

const initialErrors = {
    name: '',
    mobileNumber: '',
    email: '',
    password: ''
}

const UserPopup = ({ title, isPopupOpen, closePopup, user, onEdit, onAdd, type = 'add' }) => {

    const [userData, setUserData] = useState({
        id: user?.id || '',
        name: user?.name || '',
        mobileNumber: user?.mobileNumber || '',
        email: user?.email || '',
        password: '',
    });

    const [errors, setErrors] = useState(initialErrors)

    useEffect(() => {
        setUserData({
            id: user?.id || '',
            name: user?.name || '',
            mobileNumber: user?.mobileNumber || '',
            email: user?.email || '',
            password: '',
        })
    }, [user]);


    useEffect(() => {
        if (isPopupOpen === false) {
            setUserData({
                id: user?.id || '',
                name: user?.name || '',
                mobileNumber: user?.mobileNumber || '',
                email: user?.email || '',
                password: '',
            })

            setErrors(initialErrors);
        }
    }, [isPopupOpen])

    const handleChange = (e) => {
        setErrors({ ...errors, [e.target.name]: ''});
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const validateUser = () => {

        userData.name = userData?.name?.trim();
        userData.email = userData?.email?.trim();
        userData.mobileNumber = userData?.mobileNumber?.trim();
        userData.password = userData?.password?.trim();

        let isValid = true;
        const newErrors = {
            name: '',
            mobileNumber: '',
            email: '',
            password: ''
        }

        if (!validateNotEmpty(userData.name)) {
            newErrors.name = `Name is required!`
            isValid = false;
        } else if (!validateAlphabet(userData.name)) {
            newErrors.name = `Special characters/numbers are not alowed!`
            isValid = false;
        }

        if (!validateNotEmpty(userData.email)) {
            newErrors.email = `Email is required!`
            isValid = false;
        } else if (!validateEmail(userData.email)) {
            newErrors.email = `Enter a valid email!`
            isValid = false;
        } else if (!validateEmailDomain(userData.email)) {
            newErrors.email = `Enter a valid email domain!`
            isValid = false;
        }

        if (!validateNotEmpty(userData.mobileNumber)) {
            newErrors.mobileNumber = `Mobile no. is required!`
            isValid = false;
        } else if (!validateMobile(userData.mobileNumber)) {
            newErrors.mobileNumber = `Enter a valid 10-digit mobile no.`
            isValid = false;
        }

        if (userData.password.length > 0) {
            if (!validatePassword(userData.password)) {
                newErrors.password = `Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.`
                isValid = false;
            }
        }

        if (!isValid) {
            setErrors(newErrors);
        }

        return isValid;
    }

    const handleAdd = () => {
        if (validateUser()) {
            onAdd(userData);
        }
    }

    const handleEdit = () => {
        if(validateUser()) {
            onEdit(userData, user?.mobileNumber)
            closePopup();
        }
    }

    return (
        <Popup isOpen={isPopupOpen} title={title} onClose={closePopup} >
            <Input type={'text'} value={userData.name} name={'name'} onChange={(e) => handleChange(e)} label={'Name'} placeholder={'Enter name'} error={errors.name} />
            <Input type={'text'} value={userData.mobileNumber} name={'mobileNumber'} onChange={(e) => handleChange(e)} label={'Mobile'} placeholder={'Enter mobile no.'} error={errors.mobileNumber} />
            <Input type={'email'} value={userData.email} name={'email'} onChange={(e) => handleChange(e)} label={'Email'} placeholder={'Enter email'} error={errors.email} />
            {type === 'edit' && <Input type={'text'} value={userData.password} name={'password'} onChange={(e) => handleChange(e)} label={'Password'} placeholder={'Enter password'} error={errors.password} />}
            <div className="user-update-btn">
                {
                    type === 'edit' ?
                        <Button onClick={() => handleEdit()} varient={'primary'} >Update</Button> :
                        <Button onClick={() => handleAdd()} varient={'primary'} >Add</Button>
                }
            </div>
        </Popup>
    )
}

export default UserPopup