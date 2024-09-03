import React, { useEffect, useState } from 'react'
import './Issuance.css'
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import { FilterIcon } from '../../../components/icons/Icons'
import Table from '../../../components/table/Table'
import { useSelector } from 'react-redux'
import { deleteIssuance, getAllIssuances, updateIssuance } from '../../../api/services/Issuance'
import toast from '../../../components/toast/toast'
import IssuanceFilterPopup from '../../../components/popup/IssuanceFilterPopup'

const issuanceCols = ['Id', 'User', 'Book', 'Issue', 'Return', 'Actual return', 'Status', 'Type'];

const Issuance = () => {

  const auth = useSelector(state => state.auth);

  const [issuanceData, setIssuanceData] = useState({
    id: '',
    user: '',
    book: '',
    issueTime: '',
    returnTime: '',
    status: '',
    issuanceType: '',
  });

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  useEffect(() => {
    loadIssuances();
  }, [filterParams])

  useEffect(() => {
    // loadIssuances();
    setFilterParams({...filterParams, page, size, sortBy, sortDir})
  }, [page, size, sortBy, sortDir]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadIssuances();
    }, 1000)

    return () => clearTimeout(timeout);
  }, [search])


  const loadIssuances = async () => {
    try {
      const data = await getAllIssuances(filterParams);

      if (Array.isArray(data)) {
        setIssuances(data);
      } else {
        setIssuances(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log('Error fetching issuances', error);
    }
  }

  const handleEdit = async (issuanceObj) => {
    const id = issuanceObj?.id;
    const issuenceObject = {
      user: issuanceObj?.user?.id,
      book: issuanceObj?.book?.id,
      // issueTime: issuanceObj?.issueTime,
      returnTime: issuanceObj?.returnTime,
      status: issuanceObj?.status,
      issuanceType: issuanceObj?.issuanceType,
    }

    try {
      const data = await updateIssuance(id, issuenceObject, auth.token);
      toast.success(data?.message || `Successfully updated`);
      await loadIssuances();
    } catch (error) {
      console.log(error);
      toast.error(`Failed to update`)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you really want to delete?')) {
      console.log('DELETE', id);

      try {
        const data = await deleteIssuance(id, auth.token);
        toast.success(data?.message || `Successfully deleted`)
        await loadIssuances();
      } catch (error) {
        console.log(`Failed to delete`);
      }

    }
  }

  const handleAddNewIssuance = async (issuanceObj) => {
    console.log('ADD', issuanceObj);

    // TODO - Make an api call to 
  }

  const handleSort = (col, isDesc) => {
    const colMapping = {
      'Id': 'id',
      'User': 'user',
      'Book': 'book'
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

    filterObj.page = page;
    filterObj.size = size;
    filterObj.sortBy = sortBy;
    filterObj.sortDir = sortDir;


    setFilterParams(filterObj);
    closeFilter();
  }


  return (
    <div className='issuance-page'>
      <div className="issuance-header">
        <div className="filter-section">
          {/* <Searchbar placeholder={'Search issuance'} onSearch={handleSearch} /> */}
          <div onClick={openFilter} className="filter-icon">
            <span>Filter</span>
            <FilterIcon size={20} />
          </div>
        </div>

        {/* <Button onClick={openPopup} varient={'primary'} >Add</Button> */}
      </div>

      <div className="">
        <Table colums={issuanceCols} data={issuances} currentPage={page} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} addDelete={false} addEdit={true} onEdit={handleEdit} onDelete={handleDelete} type={'issuance'} />
      </div>


      <IssuanceFilterPopup isOpen={isFilterOpen} onClose={closeFilter} title={'Filter issuance'} onFilter={handleFilter} />
      {/* <IssuancePopup title={'Add issuance'} isPopupOpen={isPopupOpen} closePopup={closePopup} onAdd={handleAddNewIssuance} book={issuanceData} type='add' /> */}

    </div>
  )
}

export default DashboardHOC(
  Issuance,
)