import React, { useEffect, useState } from 'react'
import Popup from './Popup'
import Input from '../form/input/Input'
import Button from '../button/Button'
import { validateAlphabet, validateMinLength, validateNotEmpty } from '../../libs/utils'

const initialError = {
    name: '',
}

const CategoryPopup = ({title, isPopupOpen, closePopup, category, onEdit, onAdd, type='add' }) => {

    const [errors, setErrors] = useState(initialError)

    const [categoryData, setCategoryData] = useState({
        id: category?.id || '',
        name: category?.name || '',
    });

    useEffect(() => {
        setCategoryData({
            id: category?.id || '',
            name: category?.name || '',
        })
    }, [category])

    useEffect(() => {
        if (isPopupOpen === false) {
            setCategoryData({
                id: category?.id || '',
                name: category?.name || '',
            })
            setErrors(initialError);
        }
    }, [isPopupOpen])

    
    const handleChange = (e) => {
        setErrors(initialError)
        setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
    }

    const validateCategory = () => {
        let isValid = true;
        const newErrors = { name: '' }

        if (!validateNotEmpty(categoryData?.name)) {
            newErrors.name = `Category name can't be empty`;
            isValid = false;
        } else if (!validateMinLength(categoryData.name, 3)) {
            newErrors.name = `Category name should have atleast 3 characters!`
            isValid = false;
        } else if (!validateAlphabet(categoryData.name)) {
            newErrors.name = `Special characters/numbers are not alowed!`
            isValid = false;
        }

        if (!isValid) {
            setErrors(newErrors);
        }

        return isValid;
    }

    const handleAdd = () => {
        if (validateCategory()) {
            onAdd(categoryData);
            closePopup();
        }
        
    }

    const handleEdit = () => {
        if (validateCategory()) {
            onEdit(categoryData);
            closePopup();
        }
       
    }


    return (
        <Popup isOpen={isPopupOpen} title={title} onClose={closePopup} >
            <Input type={'text'} value={categoryData.name} name='name' onChange={handleChange} label={'Name'} placeholder={'Enter category name'} error={errors?.name} />
            <div className="cat-update-btn">
                {
                    type === 'edit' ?
                    <Button onClick={() => handleEdit()} varient={'primary'} >Update</Button> :
                    <Button onClick={() => handleAdd()} varient={'primary'} >Add</Button>
                }
            </div>
        </Popup>
    )
}

export default CategoryPopup