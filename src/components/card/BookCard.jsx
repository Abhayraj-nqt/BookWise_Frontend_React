import React, { useState } from 'react'
import './BookCard.css'
import Card from './Card';
import { FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import Popup from '../popup/Popup';
import Input from '../form/input/Input';
import Select from '../form/select/Select';
import Button from '../button/Button';

const initialCategories = [
    { id: 1, name: 'History' },
    { id: 2, name: 'Politics' },
    { id: 3, name: 'Geography' },
    { id: 4, name: 'Math' },
    { id: 5, name: 'Science' }
  ]

const BookCard = ({ book, iconSize = 20, onDelete, onEdit }) => {

    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        avlQty: '',
        image: '',
        category: '',
    });
    const [categories, setCategories] = useState(initialCategories);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const _setBookData = (book) => {
        setBookData({
          title: book.title,
          author: book.author,
          avlQty: book.avlQty,
          category: book.category.name,
          image: book.image,
        })
    }

    const handleChange = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    }

    return (
        <>
            <Card key={book.id} className={'book-card'}>
                <div className="book-details">
                    <h3>{book.title}</h3>
                    <p> <span>Category: </span>{book.category.name}</p>
                    <p> <span>Author: </span> {book.author}</p>
                    <p> <span>Qty: </span> {book.avlQty}</p>
                </div>

                <div className="book-actions">
                    <div onClick={() => { openPopup(true); _setBookData(book); }} className="book-edit-icon icon">
                        <FaRegEdit size={iconSize} />
                    </div>
                    <div onClick={() => onDelete(book.id)} className="book-delete-icon icon">
                        <AiOutlineDelete size={iconSize} />
                    </div>
                </div>

            </Card>

            <Popup isOpen={isPopupOpen} title={'Edit book'} onClose={closePopup} >
                <Input type={'text'} value={bookData.title} name={'title'} onChange={(e) => handleChange(e)} label={'Title'} placeholder={'Enter book title'} />
                <Input type={'text'} value={bookData.author} name={'author'} onChange={(e) => handleChange(e)} label={'Author'} placeholder={'Enter author name'} />
                <Input type={'number'} value={bookData.avlQty} name={'avlQty'} onChange={(e) => handleChange(e)} label={'Quantity'} placeholder={'Enter book quantity'} />
                <Select label={'Category'} name={'category'} value={bookData.category} onChange={(e) => handleChange(e)} placeholder={'Select category'} >
                    {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                </Select>
                {/* <Input type={'text'} value={bookData.image} name={'image'} onChange={(e) => handleChange(e)} label={'Image'} placeholder={'Upload image'} /> */}
                <div className="book-update-btn">
                    <Button onClick={() => onEdit(book.id, bookData)} varient={'primary'} >Update</Button>
                </div>
            </Popup>
        </>

    )
}

export default BookCard