import React, { useEffect, useState } from 'react'
import './History.css'
import { useSelector } from 'react-redux'
import Table from '../../../components/table/Table'
import { getUserHistory } from '../../../api/services/user'

const tableCols = [
  "Id",
  "Book",
  "Issue",
  "Expected return",
  "Actual return",
  "Status",
  "Type"
]

const History = () => {

  const auth = useSelector(state => state.auth);
  const [userHistory, setUserHistory] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  // const [search, setSearch] = useState('')
  const [filterParams, setFilterParams] = useState({
    page: page,
    size: size,
    sortBy: sortBy,
    sortDir: sortDir,
})

  useEffect(() => {
    loadUserHistory();
  }, [filterParams]);

  useEffect(() => {
    setFilterParams({...filterParams, page, size, sortBy, sortDir});
  }, [page, size, sortBy, sortDir]);

  const loadUserHistory = async () => {
    try {
      // await loadUser();
      const data = await getUserHistory(auth.mobileNumber, filterParams)
      setUserHistory(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
      console.log("Failed to load user history");
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
      'Type': 'issuanceType'
    }

    setSortBy(colMapping[col]);
    if (isDesc) {
      setSortDir('desc');
    } else {
      setSortDir('asc');
    }

  }

  return (
    <div className='history-Page'>
      <h2 className='history-title'>Your history</h2>
      <Table colums={tableCols} data={userHistory} currentPage={page} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} type={'userHistory'} />
    </div>
  )
}

export default History