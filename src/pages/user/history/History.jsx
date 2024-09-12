import React, { useEffect, useState } from 'react'
import './History.css'
import { useSelector } from 'react-redux'
import Table from '../../../components/table/Table'
import { getUserHistory } from '../../../api/services/user'
import toast from '../../../components/toast/toast'
import Loader from '../../../components/loader/Loader'

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

  const [loading, setLoading] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  const [size, setSize] = useState(() => {
    if (viewportHeight >= 1024) {
      return 10;
    } else if (viewportHeight < 1024 && viewportHeight > 768) {
      return 8;
    } else {
      return 5;
    }
  });

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');
  const [filterParams, setFilterParams] = useState({
    page: page,
    size: size,
    sortBy: sortBy,
    sortDir: sortDir,
  })

  useEffect(() => {

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (viewportHeight >= 1024) {
      setSize(10);
    } else if (viewportHeight < 1024 && viewportHeight > 768) {
      setSize(8);
    } else {
      setSize(5);
    }
  }, [viewportHeight]);


  useEffect(() => {
    loadUserHistory();
  }, [filterParams]);

  useEffect(() => {
    setFilterParams({ ...filterParams, page, size, sortBy, sortDir });
  }, [page, size, sortBy, sortDir]);


  const loadUserHistory = async () => {
    try {
      setLoading(true);
      const data = await getUserHistory(auth?.mobileNumber, filterParams)
      setUserHistory(data?.content);
      setTotalPages(data?.totalPages);
    } catch (error) {
      toast.error('Failed to load user history')
    } finally {
      setLoading(false);
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
    <>
      {loading && <Loader />}
      <div className='history-Page'>
        <h2 className='history-title'>Your history</h2>
        <Table colums={tableCols} data={userHistory} currentPage={page} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} type={'userHistory'} />
      </div>
    </>
  )
}

export default History