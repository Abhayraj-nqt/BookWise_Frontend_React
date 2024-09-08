import React, { useEffect, useState } from 'react'

// Components
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import Table from '../../../components/table/Table'
import IssuanceFilterPopup from '../../../components/popup/IssuanceFilterPopup'
import Searchbar from '../../../components/searchbar/Searchbar'
import toast from '../../../components/toast/toast'
import { FilterIcon } from '../../../components/icons/Icons'

// Functions
import { deleteIssuance, getAllIssuances, updateIssuance } from '../../../api/services/Issuance'

// CSS
import './Issuance.css'

// Constants
const issuanceCols = ['Id', 'User', 'Book', 'Issue', 'Return', 'Actual return', 'Status', 'Type'];

const Issuance = ({setLoading, rowCount}) => {

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(rowCount || 5);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('')

  const [filterParams, setFilterParams] = useState({
    page: page,
    size: size,
    sortBy: sortBy,
    sortDir: sortDir,
    search: search,
})

  const [issuances, setIssuances] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  useEffect(() => {
    loadIssuances();
  }, [filterParams])

  useEffect(() => {
    setSize(rowCount);
  }, [rowCount])

  useEffect(() => {
    setFilterParams({...filterParams, page, size, sortBy, sortDir})
  }, [page, size, sortBy, sortDir]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      resetFilter();
    }, 1000)

    return () => clearTimeout(timeout);
  }, [search])


  const loadIssuances = async () => {
    try {
      setLoading(true);
      const data = await getAllIssuances(filterParams);
      if (Array.isArray(data)) {
        setIssuances(data);
      } else {
        setIssuances(data?.content);
        setTotalPages(data?.totalPages);
      }
    } catch (error) {
      toast.error('Error fetching issuances');
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = async (issuanceObj) => {
    const id = issuanceObj?.id;
    const issuenceObject = {
      user: issuanceObj?.user?.id,
      book: issuanceObj?.book?.id,
      returnTime: issuanceObj?.returnTime,
      status: issuanceObj?.status,
      issuanceType: issuanceObj?.issuanceType,
    }

    try {
      setLoading(true);
      const data = await updateIssuance(id, issuenceObject);
      toast.success(data?.message || `Successfully updated`);
      await loadIssuances();
    } catch (error) {
      toast.error(`Failed to update issuance`)
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you really want to delete?')) {
      try {
        setLoading(true);
        const data = await deleteIssuance(id);
        toast.success(data?.message || `Successfully deleted`)
        await loadIssuances();
      } catch (error) {
        toast.error(`Failed to delete issuance`);
      } finally {
        setLoading(false);
      }

    }
  }

  const handleSort = (col, isDesc) => {
    const colMapping = {
      'Id': 'id',
      'User': 'user.name',
      'Book': 'book.title',
      'Issue': 'issueTime',
      'Return': 'expectedReturnTime',
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

  const handleSearch = (searchQuery) => {
    setSearch(searchQuery);
  };

  const handleFilter = (filterObj) => {

    filterObj.page = page;
    filterObj.size = size;
    filterObj.sortBy = sortBy;
    filterObj.sortDir = sortDir;


    setFilterParams(filterObj);
    closeFilter();
  }

  const resetFilter = () => {
    setFilterParams({
      page, size, sortBy, sortDir, search,
    })
  }


  return (
    <div className='issuance-page'>
      <div className="issuance-header">
        <Searchbar placeholder={'Search issuances by user or book'} onSearch={handleSearch} />
        <div onClick={openFilter} className="filter-icon">
          <span>Filter</span>
          <FilterIcon size={20} />
        </div>
      </div>
      <br />
      
      <div className="">
        <Table colums={issuanceCols} data={issuances} currentPage={page} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} addDelete={false} addEdit={true} onEdit={handleEdit} onDelete={handleDelete} type={'issuance'} />
      </div>


      <IssuanceFilterPopup isOpen={isFilterOpen} onClose={closeFilter} title={'Filter issuance'} onFilter={handleFilter} />

    </div>
  )
}

export default DashboardHOC(
  Issuance,
)