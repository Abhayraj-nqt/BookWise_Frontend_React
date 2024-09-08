import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// CSS
import './BookHistory.css'

// Components
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import Table from '../../../components/table/Table'
import toast from '../../../components/toast/toast'

// Functions
import { getBookById, getBookHistory } from '../../../api/services/book'

const tableCols = [
    "Id",
    "User",
    "Issue",
    "Expected return",
    "Actual return",
    "Status",
    "Type"
]

const BookHistory = ({setLoading, rowCount}) => {

    const {bookId} = useParams();

    const [book, setBook] = useState();
    const [bookHistory, setBookHistory] = useState([]);

    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(rowCount || 5);
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('asc');
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadBookHistory();
    }, [page, size, sortBy, sortDir])

    useEffect(() => {
        setSize(rowCount);
      }, [rowCount])

    const loadBookHistory = async () => {
        try {
            setLoading(true)
            await loadBook();
            const data = await getBookHistory(bookId, {page, size, sortBy, sortDir, search});
            setBookHistory(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error(`Failed to load book history`);
        } finally {
            setLoading(false);
        }
    }

    const loadBook = async () => {
        try {
            const data = await getBookById(bookId);
            setBook(data);
        } catch (error) {
            toast.error(`Failed to load book`);
        }
    }

    const handleSort = (col, isDesc) => {
        const colMapping = {
            'Id': 'id',
            'Book': 'book',
            'Issue': 'issueTime',
            'Expected return': 'expectedReturnTime',
            'Actual return': 'actualReturnTime',
            'Status': 'status',
            'Type': 'type'
        }

        setSortBy(colMapping[col]);
        if (isDesc) {
            setSortDir('desc');
        } else {
            setSortDir('asc');
        }

    }

  return (
        <div>
            <h2 className='history-title'>{book?.title}'s history</h2>
            <Table colums={tableCols} data={bookHistory} currentPage={page} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} type={'userHistory'} />
        </div>
  )
}

export default DashboardHOC(BookHistory);