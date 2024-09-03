import React, { useEffect, useState } from 'react'
import './AdminUserHistory.css'
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import { useParams } from 'react-router-dom'

import { getUserByMobile, getUserHistory } from '../../../api/services/user'
import { useSelector } from 'react-redux'
import toast from '../../../components/toast/toast'
import Table from '../../../components/table/Table'
import IssuanceFilterPopup from '../../../components/popup/IssuanceFilterPopup'
import { FilterIcon } from '../../../components/icons/Icons'

const tableCols = [
    "Id",
    "Book",
    "Issue",
    "Expected return",
    "Actual return",
    "Status",
    "Type"
]

const AdminUserHistory = () => {

    const { mobile } = useParams();

    const auth = useSelector(state => state.auth);
    const [user, setUser] = useState();
    const [firstName, setFirstName] = useState('');
    const [userHistory, setUserHistory] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    }, [filterParams])

    useEffect(() => {
        setFilterParams({...filterParams, page, size, sortBy, sortDir});
    }, [page, size, sortBy, sortDir]);

    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);

    const loadUserHistory = async () => {
        try {
            await loadUser();
            const data = await getUserHistory(mobile, filterParams)
            setUserHistory(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load user history");
        }
    }

    const loadUser = async () => {
        try {
            const data = await getUserByMobile(mobile);
            setUser(data);
            const firstNameOfUser = data?.name.split(' ')[0];
            setFirstName(firstNameOfUser);
        } catch (error) {
            console.log(error);
            toast.error(`Failed to find user`);
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

    const handleFilter = (filterObj) => {

        filterObj.page = page;
        filterObj.size = size;
        filterObj.sortBy = sortBy;
        filterObj.sortDir = sortDir;

        setFilterParams(filterObj);
        closeFilter();
    }

    return (
        <div>
            <h2 className='user-admin-history-title'>{firstName}'s history</h2>
            <div onClick={openFilter} className="filter-icon">
                <span>Filter</span>
                <FilterIcon size={20} />
            </div>
            <Table colums={tableCols} data={userHistory} currentPage={page} totalPages={totalPages} onPageChange={setPage} sortBy={'Id'} onSort={handleSort} type={'userHistory'} />

            <IssuanceFilterPopup isOpen={isFilterOpen} onClose={closeFilter} title={'Filter user history'} onFilter={handleFilter} />
        </div>
    )
}

export default DashboardHOC(AdminUserHistory);