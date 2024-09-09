import React, { useEffect, useState } from 'react'

// Components
import Popup from './Popup';
import Input from '../form/input/Input';
import Select from '../form/select/Select';
import Button from '../button/Button';

// Functions
import { getAllCategories } from '../../api/services/category';
import { validateAlphabet, validateMinLength, validateNotEmpty } from '../../libs/utils';
import toast from '../toast/toast';

const initialErrors = {
    title: '',
    author: '',
    totalQty: '',
    category: ''
}

const BookPopup = ({title, isPopupOpen, closePopup, book, onEdit, onAdd, type='add'}) => {

    const [categories, setCategories] = useState([]);
    const [bookData, setBookData] = useState({
        id: book?.id || '',
        title: book?.title || '',
        author: book?.author || '',
        totalQty: book?.totalQty || '',
        image: book?.image || '',
        category: book?.category?.id || '',
    });

    const [errors, setErrors] = useState(initialErrors);

    useEffect(() => {
        setBookData({
            id: book?.id || '',
            title: book?.title || '',
            author: book?.author || '',
            totalQty: book?.totalQty || '',
            image: book?.image || '',
            category: book?.category?.id || '',
        })
    }, [book])

    useEffect(() => {
        loadCategories();
    }, [])

    const loadCategories = async () => {
      try {
        const data = await getAllCategories({"page": undefined, "size":undefined, sortBy:'name', sortDir:'asc'})
        setCategories(data);
      } catch (error) {
        toast.error('Error fetching categories')
      }
    }

    useEffect(() => {
        if (isPopupOpen === false) {
            setBookData({
                id: book?.id || '',
                title: book?.title || '',
                author: book?.author || '',
                totalQty: book?.totalQty || '',
                image: book?.image || '',
                category: book?.category?.id || '',
            })

            setErrors(initialErrors);
        }
    }, [isPopupOpen])

    const handleChange = (e) => {
        setErrors({ ...errors, [e.target.name]: ''});
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    }

    const validateBook = () => {

        bookData.author = bookData?.author?.trim();
        bookData.title = bookData?.title?.trim();

        let isValid = true;
        const newErrors = {
            title: '',
            author: '',
            totalQty: '',
            category: ''
        }

        if (!validateNotEmpty(bookData.title)) {
            newErrors.title = `Title is required!`
            isValid = false;
        } else if (!validateMinLength(bookData.title, 3)) {
            newErrors.title = `Title should have atleast 3 characters!`
            isValid = false;
        } else if (!validateAlphabet(bookData.title)) {
            newErrors.title = `Special characters/numbers are not alowed!`
            isValid = false;
        }

        if (!validateNotEmpty(bookData.author)) {
            newErrors.author = `Author name is required!`
            isValid = false;
        } else if (!validateMinLength(bookData.author, 3)) {
            newErrors.author = `Author name should have atleast 3 characters!`
            isValid = false;
        } else if (!validateAlphabet(bookData.author)) {
            newErrors.author = `Special characters/numbers are not alowed!`
            isValid = false;
        }

        if (!validateNotEmpty(bookData.category)) {
            newErrors.category = `Category is required!`
            isValid = false;
        }

        if (!validateNotEmpty(bookData.totalQty)) {
            newErrors.totalQty = `Quantity is required!`
            isValid = false;
        } else if (bookData.totalQty < 1) {
            newErrors.totalQty = `Quantity can't be less than 1`
            isValid = false;
        }

        if (!isValid) {
            setErrors(newErrors);
        }

        return isValid;

    }

    const handleAdd = () => {
        if (validateBook()) {
            onAdd(bookData);
            closePopup();
        }
    }

    const handleEdit = () => {
        if (validateBook()) {
            onEdit(bookData);
            closePopup();
        }
        
    }

    return (
        <Popup isOpen={isPopupOpen} title={title} onClose={closePopup} >
            <Input type={'text'} value={bookData.title} name={'title'} onChange={(e) => handleChange(e)} label={'Title'} placeholder={'Enter book title'} error={errors.title} />
            <Input type={'text'} value={bookData.author} name={'author'} onChange={(e) => handleChange(e)} label={'Author'} placeholder={'Enter author name'} error={errors.author} />
            <Input type={'number'} value={bookData.totalQty} name={'totalQty'} onChange={(e) => handleChange(e)} label={'Quantity'} placeholder={'Enter book quantity'} error={errors.totalQty} min={1} />
            <Select label={'Category'} name={'category'} value={bookData.category} onChange={(e) => handleChange(e)} placeholder={'Select category'} error={errors.category} >
                <option value="">Select category</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Select>
          
            <div className="book-update-btn">
                {
                    type === 'edit' ?
                    <Button onClick={() => handleEdit()} varient={'primary'} >Update</Button> :
                    <Button onClick={() => handleAdd()} varient={'primary'} >Add</Button> 
                }
            </div>
        </Popup>
    )
}

export default BookPopup