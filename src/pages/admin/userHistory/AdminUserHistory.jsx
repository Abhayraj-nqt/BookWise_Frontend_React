import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// CSS
import './AdminUserHistory.css'

// Components
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import Table from '../../../components/table/Table'
import IssuanceFilterPopup from '../../../components/popup/IssuanceFilterPopup'
import toast from '../../../components/toast/toast'
import { BackwardIcon, FilterIcon } from '../../../components/icons/Icons'

// Functions
import { getUserByMobile, getUserHistory } from '../../../api/services/user'

const tableCols = [
    "Id",
    "Book",
    "Issue",
    "Expected return",
    "Actual return",
    "Status",
    "Type"
]

const AdminUserHistory = ({setLoading, rowCount}) => {

    const { mobile } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState();
    const [firstName, setFirstName] = useState('');
    const [userHistory, setUserHistory] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(rowCount || 5);
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

    useEffect(() => {
        setSize(rowCount);
    }, [rowCount])

    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);

    const goBack = () => {
        navigate(-1);
    }

    const loadUserHistory = async () => {
        try {
            setLoading(true);
            await loadUser();
            const data = await getUserHistory(mobile, filterParams)
            setUserHistory(data?.content);
            setTotalPages(data?.totalPages);
        } catch (error) {
            toast.error("Error fetching user history");
        } finally {
            setLoading(false);
        }
    }

    const loadUser = async () => {
        try {
            const data = await getUserByMobile(mobile);
            setUser(data);
            const firstNameOfUser = data?.name.split(' ')[0];
            setFirstName(firstNameOfUser);
        } catch (error) {
            toast.error(`User not found`);
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
            <div className="history-header-admin">
                <h2 className='user-admin-history-title'>{firstName}'s history</h2>
                <div onClick={goBack} className="go-back-link"><BackwardIcon /> Go back</div>
            </div>
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