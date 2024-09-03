import React, { useEffect, useState } from 'react'
import Popup from './Popup'
import { getAllCategories } from '../../api/services/category';
import Button from '../button/Button';
import Select from '../form/select/Select';
import Input from '../form/input/Input';

const BookFilterPopup = ({ title, isPopupOpen, closePopup, onFilter }) => {

    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [filter, setFilter] = useState({
        category: '',
        author: '',
        outOfStock: false,
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadAuthors();
    }, [])

    const loadCategories = async () => {
        try {
            const data = await getAllCategories(undefined, undefined, 'name', 'asc')
            setCategories(data);
        } catch (error) {
            console.log(error);
        }
    }

    const loadAuthors = async () => {
        try {
            // TODO - Make an api call to fetch all authors
            console.log('Authors loaded', authors);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {

        const { name, type, checked, value } = e.target;
        setFilter({
            ...filter,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    const clearFilters = () => {
        setFilter({
            category: '',
            author: '',
            outOfStock: false,
        });
    }

    return (
        <Popup isOpen={isPopupOpen} title={title} onClose={closePopup} >
            <Select label={'Category'} name={'category'} value={filter.category} onChange={(e) => handleChange(e)} placeholder={'Select category'} >
                <option value="">Select category</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </Select>
            <Select label={'Author'} name={'author'} value={filter.author} onChange={(e) => handleChange(e)} placeholder={'Select author'} >
                <option value="">Select author</option>
                {authors.map(author => <option key={author} value={author}>{author}</option>)}
            </Select>
            <div className="out-of-stock">
                <input name={'outOfStock'} value={filter.outOfStock} onChange={(e) => handleChange(e)} type='checkbox' checked={filter.outOfStock}  />
                <div>Include out of stock</div>
            </div>
            <div className="filter-btns">
                <Button onClick={() => onFilter(filter)} varient={'primary'}>Filter</Button>
                <Button onClick={() => clearFilters()} varient={'secondary'}>Clear</Button>
            </div>
        </Popup>
    )
}

export default BookFilterPopup