import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// CSS
import './Table.css'

// Components
import { DeleteIcon, EditIcon, SortingIcon } from '../icons/Icons'
import CategoryPopup from '../popup/CategoryPopup'
import BookPopup from '../popup/BookPopup'
import Pagination from '../pagination/Pagination'
import UserPopup from '../popup/UserPopup'
import Button from '../button/Button'
import BookSheet from '../sheet/BookSheet'
import UserSheet from '../sheet/UserSheet'
import IssuancePopup from '../popup/IssuancePopup'

const Table = ({ colums=[], data=[], currentPage=0, size=5, totalPages=1, onPageChange='', sortBy='id', sortDir='asc', onSort='', addEdit=false, addDelete=false, onEdit, onDelete, iconSize = 25, type, setLoading, renderList}) => {

    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const [popupData, setPopupData] = useState(null);
    const [sheetData, setSheetData] = useState(null);

    const [isDesc, setIsDesc] = useState(false);

    const handleSheet = (row) => {
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
            return <BookSheet isSheetOpen={isSheetOpen} onClose={toggleSheet} bookData={sheetData} setLoading={setLoading} renderList={renderList} />
        } else if (type === 'user') {
            return <UserSheet isSheetOpen={isSheetOpen} onClose={toggleSheet} userData={sheetData} setLoading={setLoading} />
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
                                    {i !== 0 && onSort && <span data-testid={`sort-${col}`} onClick={() => handleSort(col)} className='table-sort-btn pointer'><SortingIcon size={15} /></span>}
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
                                    if (key === 'id') {
                                        
                                        return <td key={key}>{currentPage * size + i + 1}</td>
                                    } else if (key === 'image' || key === 'role' || Boolean(key) === false) {
                                        return null; 
                                    } else {

                                        if (key === 'actualReturnTime' && !value) {
                                            return  <td key={key}>
                                                        <div className='not-returned'>Not returned</div>
                                                    </td>
                                        } else if (key === 'status') {
                                            return  <td key={key}>
                                                        <div className={`${value?.toLowerCase()}`}>{value}</div>
                                                    </td>
                                        } else if (key === 'type') {
                                            return  <td className='no-wrap' key={key}>
                                                        <div className={`no-wrap`}>{value}</div>
                                                    </td>
                                        }
                                       
                                        return (
                                            (type === 'issuance' || type === 'userHistory')
                                                ? <td key={key}>
                                                    {typeof value === 'object' 
                                                        ? value?.name || value?.title 
                                                        : (key === 'issueTime' || key === 'expectedReturnTime' || key === 'actualReturnTime') ? (
                                                            value ? <div className="">
                                                                        <div className="no-wrap">{new Date(value).toLocaleDateString('en-GB')}</div>
                                                                        <div className="no-wrap">{new Date(value).toLocaleTimeString()}</div>
                                                                    </div> : <div className="">Not avl.</div>
                                                        ) : 
                                                                                                            
                                                        value ? value : 'Not avl.'}
                                                </td>

                                                :(type === 'book' && key === 'avlQty') ? <td key={key}>
                                                    {value}
                                                </td>
                                               
                                                : value && <td key={key}>
                                                    {typeof value === 'object' ? value?.name || value?.title : value ? value : 'Not avl.'}
                                                </td>
                                        );
                                    }

                                })}
                        

                                {(addEdit || addDelete) && <td className='table-action-btns'>
                                    {addEdit && <span data-testid={`edit-icon-${row?.id}`} onClick={() => handleEdit(row)} className='table-edit-icon icon'><EditIcon size={iconSize} /></span>}
                                    {type != 'user' && addDelete && <span data-testid={`delete-icon-${row?.id}`} onClick={() => onDelete(row?.id)} className='table-delete-icon icon'><DeleteIcon size={iconSize} /></span>}
                                    {type == 'user' && addDelete && <span onClick={() => onDelete(row?.mobileNumber)} className='table-delete-icon icon'><DeleteIcon size={iconSize} /></span>}
                                </td>}

                                {(type === 'user' || type === 'book') && 
                                    <td className=''>
                                        <span className="assign-btn">
                                            <Button onClick={() => handleSheet(row)} type={'button'} varient={'primary'}>Issue</Button>
                                        </span>
                                        <span className="view-btn">
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
            {data.length > 0 ? <div className="">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div> : <div className='table-not-found'>Not found</div>}

            {getSheet()}
            {getPopup()}
        </>
    )
}

export default Table
