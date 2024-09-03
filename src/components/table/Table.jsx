import React, { useState } from 'react'

// CSS
import './Table.css'

// Components
import { DeleteIcon, EditIcon } from '../icons/Icons'
import CategoryPopup from '../popup/CategoryPopup'
import BookPopup from '../popup/BookPopup'
import Pagination from '../pagination/Pagination'

import { SortingIcon } from '../icons/Icons'
import UserPopup from '../popup/UserPopup'
import Button from '../button/Button'
import BookSheet from '../sheet/BookSheet'
import UserSheet from '../sheet/UserSheet'
import IssuancePopup from '../popup/IssuancePopup'
import { useNavigate } from 'react-router-dom'

const Table = ({ colums=[], data=[], currentPage=0, totalPages=1, onPageChange='', sortBy='id', sortDir='asc', onSort='', addEdit=false, addDelete=false, onEdit, onDelete, iconSize = 25, type}) => {

    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const [popupData, setPopupData] = useState(null);
    const [sheetData, setSheetData] = useState(null);

    const [isDesc, setIsDesc] = useState(false);

    const handleSheet = (row) => {
        // setIsSheetOpen(prev => !prev);
        toggleSheet();
        setSheetData(row);
    }

    const toggleSheet = () => setIsSheetOpen(prev => !prev);

    const toggleOrder = () => {
        setIsDesc(prev => !prev);
    }

    const handleSort = (col) => {
        toggleOrder();
        onSort(col, isDesc);
    }

    // const openPopup = () => setIsPopupOpen(true);
    const openPopup = (row) => {
        setPopupData(row);
        setIsPopupOpen(true);
    }
    const closePopup = () => {
        setPopupData(null);
        setIsPopupOpen(false);
    }

    const handleEdit = (row) => {
        openPopup(row);
    }

    const getPopup = () => {

        if (type === 'category') {
            return (
                <CategoryPopup title={'Edit category'} category={popupData} isPopupOpen={isPopupOpen} closePopup={closePopup} onEdit={onEdit} type='edit'  />
            )
        } else if (type === 'book') {

            return (
                <BookPopup title={'Edit book'} book={popupData} isPopupOpen={isPopupOpen} onEdit={onEdit} closePopup={closePopup} type='edit' />
            )

        } else if (type === 'user') {
            return (
                <UserPopup title={'Edit user'} user={popupData} isPopupOpen={isPopupOpen} closePopup={closePopup} onEdit={onEdit} type='edit'  />
            )
        } else if (type === 'issuance') {
            return (
                <IssuancePopup title={'Edit issuace'} issuance={popupData} isPopupOpen={isPopupOpen} closePopup={closePopup} onEdit={onEdit} type='edit' />
            )
        }
    }

    const getSheet = () => {
        if (type === 'book') {
            return <BookSheet isSheetOpen={isSheetOpen} onClose={toggleSheet} bookData={sheetData} />
        } else if (type === 'user') {
            return <UserSheet isSheetOpen={isSheetOpen} onClose={toggleSheet} userData={sheetData} />
        }
    }


    return (
        <>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            {colums.map((col, i) => (
                                <th key={`${col}-${i}`}  >
                                    <span>{col}</span>
                                    {onSort && <span onClick={() => handleSort(col)} className='table-sort-btn pointer'><SortingIcon size={15} /></span>}
                                </th>
                            ))}
                            {(addEdit || addDelete) && <th>Actions</th>}
                            {(type === 'user' || type === 'book') && <th className='book-action-th'>Books</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((row, i) => (
                            <tr key={`${i}-${row?.id}`} >

                                {Object.entries(row).map(([key, value]) => {
                                    if (key === 'image' || key === 'role' || Boolean(key) === false) {
                                        return null; 
                                    } else {
                                       
                                        return (
                                            (type === 'issuance' || type === 'userHistory')
                                                ? <td key={key}>
                                                    {typeof value === 'object' 
                                                        ? value?.name || value?.title 
                                                        : (key === 'issueTime' || key === 'expectedReturnTime' || key === 'actualReturnTime') ? (
                                                            value ? <div className="">
                                                                        <div className="">{new Date(value).toLocaleDateString('en-GB')}</div>
                                                                        <div className="">{new Date(value).toLocaleTimeString()}</div>
                                                                    </div> : <div className="">Not avl.</div>
                                                        ) : 
                                                        
                                                        // key === 'status' ? value.charAt(0).toUpperCase() + value.slice(1) :
                                                        
                                                        value ? value : 'Not avl.'}
                                                </td>
                                               
                                                : value && <td key={key}>
                                                    {typeof value === 'object' ? value?.name || value?.title : value ? value : 'Not avl.'}
                                                </td>
                                        );
                                    }

                                })}
                                {/* (type === 'book' && key === 'title') ?  <Link to={`/admin/book-history/${row?.id}`}>{value}</Link> : (type === 'user' && key === 'name') ?  <Link to={`/admin/user-history/${row?.mobileNumber}`}>{value}</Link> :  */}

                                {(addEdit || addDelete) && <td className='table-action-btns'>
                                    {addEdit && <span onClick={() => handleEdit(row)} className='table-edit-icon icon'><EditIcon size={iconSize} /></span>}
                                    {type != 'user' && addDelete && <span onClick={() => onDelete(row?.id)} className='table-delete-icon icon'><DeleteIcon size={iconSize} /></span>}
                                    {type == 'user' && addDelete && <span onClick={() => onDelete(row?.mobileNumber)} className='table-delete-icon icon'><DeleteIcon size={iconSize} /></span>}
                                </td>}

                                {(type === 'user' || type === 'book') && 
                                    <td className=''>
                                        <span className="assign-btn">
                                            {/* <IssuanceIcon size={25} /> */}
                                            <Button onClick={() => handleSheet(row)} type={'button'} varient={'primary'}>Issue</Button>
                                        </span>
                                        <span className="view-btn">
                                            {/* <FiEye size={25} /> */}
                                            {type === 'book' && <Button onClick={() => navigate(`/admin/book-history/${row?.id}`)} type={'button'} varient={'secondary'}>View</Button>}
                                            {type === 'user' && <Button onClick={() => navigate(`/admin/user-history/${row?.mobileNumber}`)} type={'button'} varient={'secondary'}>View</Button>}
                                        </span>
                                    </td>
                                }

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>

            {getSheet()}
            {getPopup()}
        </>
    )
}

export default Table
