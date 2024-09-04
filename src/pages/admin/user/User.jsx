import React, { useEffect, useState } from 'react'
import './User.css'
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import { useSelector } from 'react-redux'
import { getAllUsers, registerUser, removeUser, updateUser } from '../../../api/services/user'
import toast from '../../../components/toast/toast'
import Searchbar from '../../../components/searchbar/Searchbar'
import Button from '../../../components/button/Button'
import Table from '../../../components/table/Table'
import UserPopup from '../../../components/popup/UserPopup'
import AlertPopup from '../../../components/popup/AlertPopup'

const userCols = [
  "Id",
  "Name",
  "Mobile",
  "Email",
]

const User = () => {

  const auth = useSelector(state => state.auth);

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    mobileNumber: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    loadUsers();
  }, [page, size, sortBy, sortDir])

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUsers();
    }, 1000)

    return () => clearTimeout(timeout);
  }, [search])

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers({page, size, sortBy, sortDir, search});

      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        setUsers(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log('Error fetching users', error);
    }
  }

  const handleEdit = async (userObj) => {
    try {
      userObj.password = btoa(userObj.password);
      const data = await updateUser(userObj.mobileNumber, userObj);
      await loadUsers();
      closePopup();
      toast.success(data?.message || `Successfully updated`)
    } catch (error) {
      console.log(error);
      closePopup()
      toast.error('Failed to update user');
    }
  }

  const handleDelete = async (mobileNumber) => {
    setDeleteId(mobileNumber);
    openAlert()
  }

  const handleConfirmDelete = async (confirm) => {
    if (confirm && deleteId) {
      try {
        const data = await removeUser(deleteId, auth.token);
        await loadUsers();
        toast.success(data?.message || `User deleted successfully`);
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

  const handleAddNewUser = async (userObj) => {
    try {
      delete userObj?.id;
      const data = await registerUser(userObj);
      setUserData({
        id: '',
        name: '',
        mobileNumber: '',
        email: '',
        password: '',
      })
      closePopup();
      await loadUsers();
      toast.success(data?.message || `User registered successfully`);
    } catch (error) {
      closePopup();
      toast.error(`Failed to register user`);
    }
  }

  const handleSort = (col, isDesc) => {

    const colMapping = {
      'Id': 'id',
      'Name': 'name',
      'Mobile': 'mobileNumber',
      'Email': 'email',
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
    <div className='user-page'>
      <div className="user-header">
        <Searchbar placeholder={'Search user'} onSearch={handleSearch} />
        <Button onClick={openPopup} varient={'primary'} >Add</Button>
      </div>
      <br />

      <div className="">
        <Table colums={userCols} data={users} currentPage={page} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} addEdit={true} addDelete={true} onEdit={handleEdit} onDelete={handleDelete} type={'user'}  />
      </div>

      <UserPopup title={'Add user'} isPopupOpen={isPopupOpen} closePopup={closePopup} onAdd={handleAddNewUser} category={userData} type='add'  />

      <AlertPopup isOpen={isAlertOpen} onClose={closeAlert} onConfirm={handleConfirmDelete} message={`Are you really wanted to delete!\nIf you delete then the corresponding issuences will also be deleted.`} />

    </div>
  )
}

export default DashboardHOC(
  User,
)