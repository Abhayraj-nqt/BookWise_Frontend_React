import React, { useState, useEffect } from 'react'

// CSS
import './Category.css'

// Components
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import Searchbar from '../../../components/searchbar/Searchbar'
import Button from '../../../components/button/Button'
import Table from '../../../components/table/Table'
import CategoryPopup from '../../../components/popup/CategoryPopup'
import AlertPopup from '../../../components/popup/AlertPopup'

// Functions
import { removeCategory, createCategory, updateCategory, getAllCategories } from '../../../api/services/category'
import toast from '../../../components/toast/toast'

const categoryCols = [
  "S. no",
  "Name",
]

const Category = ({setLoading, rowCount}) => {

  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(rowCount || 5);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('')


  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [categoryData, setCategoryData] = useState({
    id: '',
    name: '',
  })

  useEffect(() => {
    loadCategories();
  }, [page, size, sortBy, sortDir])

  useEffect(() => {
    setSize(rowCount);
  }, [rowCount])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search?.length === 0 || search?.length >= 3) {
        loadCategories();
      }
    }, 1000)

    return () => clearTimeout(timeout);
  }, [search])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await getAllCategories({page, size, sortBy, sortDir, search});
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories(data?.content); 
        setTotalPages(data?.totalPages);
      }
    } catch (error) {
      toast.error('Error fetching categories');
    } finally {
      setLoading(false);
    }
  }

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  const handleEdit = async (categoryObj) => {

    try {
      setLoading(true);
      const data = await updateCategory(categoryObj?.id, { "name": categoryObj?.name });
      closePopup();
      await loadCategories();
      toast.success(data?.message || `Successfully updated`);
    } catch (error) {
      // closePopup();
      const msg = error?.response?.data?.message || 'Failed to update';
      toast.error(msg);
    } finally {
      setLoading(false);
    }

  }

  const handleDelete = (id) => {
    setDeleteId(id);
    openAlert();
  }

  const handleConfirmDelete = async (confirm) => {
    if (confirm && deleteId) {
      try {
        setLoading(true);
        const data = await removeCategory(deleteId);
        await loadCategories();
        toast.success(data?.message || `Successfully deleted`);
        setDeleteId(undefined);
      } catch (error) {
        const msg = error?.response?.data?.message || 'Failed to delete!';
        toast.error(msg);
        setDeleteId(undefined);
      } finally {
        setLoading(false);
      }
    } else {
      setDeleteId(undefined);
    }
  }

  const handleAddNewCategory = async (categoryObj) => {
  
    try {
      setLoading(true);
      const data = await createCategory({ "name": categoryObj?.name });
      // setCategoryData({
      //   id: '',
      //   name: '',
      // })
      closePopup();
      await loadCategories();
      toast.success(data?.message || `Category created successfully`);
    } catch (error) {
      // closePopup();
      const msg = error?.response?.data?.message || 'Failed to add category';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (col, isDesc) => {

    const colMapping = {
      'Id': 'id',
      'Name': 'name',
    }

    setSortBy(colMapping[col]);
    if (isDesc) {
      setSortDir('desc')
    } else {
      setSortDir('asc')
    }
  }

  const handleSearch = async (searchQuery) => {
    setSearch(searchQuery);
  };

  return (
    <>
      <div className='category-page'>
        <div className="category-header">
          <Searchbar placeholder={'Search category'} onSearch={handleSearch} />
          <Button onClick={openPopup} varient={'primary'} >Add</Button>
        </div>
        <br />

        <div className="">
          <Table colums={categoryCols} data={categories} currentPage={page} size={size} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} addEdit={true} addDelete={true} onEdit={handleEdit} onDelete={handleDelete} type={'category'} />
        </div>

        <CategoryPopup title={'Add category'} isPopupOpen={isPopupOpen} closePopup={closePopup} onAdd={handleAddNewCategory} category={categoryData} type='add' />

        <AlertPopup isOpen={isAlertOpen} onClose={closeAlert} onConfirm={handleConfirmDelete} message={`Are you sure you want to delete this item?\nIf you delete it then the corresponding books will also be deleted.`} />

      </div>
    </>
  )
}

export default DashboardHOC(Category);