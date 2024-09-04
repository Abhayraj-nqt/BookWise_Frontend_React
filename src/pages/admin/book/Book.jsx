import React, { useEffect, useState } from 'react'

// CSS
import './Book.css'

// Components
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import Searchbar from '../../../components/searchbar/Searchbar'
import Button from '../../../components/button/Button'
import Table from '../../../components/table/Table'

import BookPopup from '../../../components/popup/BookPopup'
import { useSelector } from 'react-redux'
import { createBook, getAllBooks, removeBook, updateBook } from '../../../api/services/book'
import toast from '../../../components/toast/toast'
import AlertPopup from '../../../components/popup/AlertPopup'

const bookCols = ['Id', 'Title', 'Author', 'Total Qty', 'Avl. Qty', 'Category'];

const Book = () => {

  const auth = useSelector(state => state.auth);

  const [bookData, setBookData] = useState({
    id: '',
    title: '',
    author: '',
    totalQty: '',
    image: '',
    category: '',
  })

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('')

  const [books, setBooks] = useState([])
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  useEffect(() => {
    loadBooks();
  }, [page, size, sortBy, sortDir])

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadBooks();
    }, 1000)

    return () => clearTimeout(timeout);
  }, [search])

  const loadBooks = async () => {
    try {
      const data = await getAllBooks({page, size, sortBy, sortDir, search});
      console.log(data);
      
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log('Error fetching books', error);
    }
  }

  const handleEdit = async (bookObj) => {
    const id = bookObj?.id;
    delete bookObj?.id;
    
    try {
      const data = await updateBook(id, bookObj);
      await loadBooks();
      closePopup();
      toast.success(data?.message || `Successfully updated`);
    } catch (error) {
      closePopup();
      toast.error(`Failed to update`)
    }
  }

  const handleDelete = (id) => {
    setDeleteId(id);
    openAlert();
  }

  const handleConfirmDelete = async (confirm) => {
    if (confirm && deleteId) {
      try {
        const data = await removeBook(deleteId);
        await loadBooks();
        toast.success(data?.message || `Successfully deleted`);
        setDeleteId(undefined);
      } catch (error) {
        const msg = error.response.data.message || 'Failed to delete!';
        toast.error(msg);
        setDeleteId(undefined);
      }
    } else {
      setDeleteId(undefined);
    }
  }

  const handleAddNewBook = async (bookObj) => {
    delete bookObj?.id;
    console.log('ADD', bookObj);

    try {
      const data = await createBook(bookObj);
      setBookData({
        id: '',
        title: '',
        author: '',
        totalQty: '',
        image: '',
        category: '',
      })
      closePopup();
      await loadBooks();
      toast.success(data?.message || `Book created successfully`);
    } catch (error) {
      closePopup();
      toast.error(`Failed to create book!`);
    }
    
  }

  const handleSort = (col, isDesc) => {
    const colMapping = {
      'Id': 'id',
      'Title': 'title',
      'Author': 'author',
      'Total qty': 'totalQty',
      'Avl. qty': 'avlQty',
      'Category': 'category',
    }

    setSortBy(colMapping[col]);
    if (isDesc) {
      setSortDir('desc');
    } else {
      setSortDir('asc');
    }
  }

  const handleSearch = (searchQuery) => {
    setSearch(searchQuery);
  };

  const handleFilter = (filterObj) => {
    console.log(filterObj);
  }

  return (
    <div className='book-page'>
      <div className="book-header">
      
        <Searchbar placeholder={'Search book'} onSearch={handleSearch} />
        <Button onClick={openPopup} varient={'primary'} >Add</Button>
      </div>
      <br />

      <div className="">
        <Table colums={bookCols} data={books} currentPage={page} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} addDelete={true} addEdit={true} onEdit={handleEdit} onDelete={handleDelete} type={'book'} />
      </div>

      <BookPopup title={'Add book'} isPopupOpen={isPopupOpen} closePopup={closePopup} onAdd={handleAddNewBook} book={bookData} type='add' />
      <AlertPopup isOpen={isAlertOpen} onClose={closeAlert} onConfirm={handleConfirmDelete} message={`Are you really wanted to delete!\nIf you delete then the corresponding issuences will also be deleted.`} />
    </div>
  )
}

export default DashboardHOC(Book);