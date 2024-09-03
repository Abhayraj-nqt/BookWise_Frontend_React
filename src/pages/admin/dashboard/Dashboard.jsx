import React, { useEffect, useState } from 'react'

// Components
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import StatisticCard from '../../../components/card/StatisticCard';
import { GroupIcon, BooksIcon, CategoryIcon, IssuanceIcon } from '../../../components/icons/Icons'

// CSS
import './Dashboard.css'
import { useSelector } from 'react-redux';
import { getStatistics } from '../../../api/services/dashboard';

const Dashboard = () => {

  const auth = useSelector(state => state.auth);

  const [statistics, setStatistics] = useState({
    "totalBooks": '',
    "totalBookTitles": '',
    "avlBooks": '',
    "totalAvlBookTitles": '',
    "totalUsers": '',
    "totalActiveUsers": '',
    "totalUsersInLibrary": '',
    "totalActiveInHouseIssuance": '',
    "totalActiveTakeAwayIssuance": '',
    "totalCategories": '',
    "totalIssuance": '',
  })

  useEffect(() => {
    loadStatistics();
  }, [])

  const loadStatistics = async () => {
    try {
      const data = await getStatistics();
      setStatistics(data);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='dashboard-page'>
      <div className="lib-details">
    
        <StatisticCard heading={'Total Issuances'} data={statistics.totalIssuance} icon={<IssuanceIcon size={30} />} />
        <StatisticCard heading={'Active issuances'} data={statistics.totalActiveInHouseIssuance+statistics.totalActiveTakeAwayIssuance} icon={<IssuanceIcon size={30} />} />
        <StatisticCard heading={'In house issuances'} data={statistics.totalActiveInHouseIssuance} icon={<IssuanceIcon size={30} />} />
        <StatisticCard heading={'Take away issuances'} data={statistics.totalActiveTakeAwayIssuance} icon={<IssuanceIcon size={30} />} />

        <StatisticCard heading={'Categories'} data={statistics.totalCategories} icon={<CategoryIcon size={30} />} />

        <StatisticCard heading={'Book count'} data={statistics.totalBooks} icon={<BooksIcon size={30} />} />
        <StatisticCard heading={'Avl. count'} data={statistics.avlBooks} icon={<BooksIcon size={30} />} />
        <StatisticCard heading={'Book types'} data={statistics.totalBookTitles} icon={<BooksIcon size={30} />} />
        <StatisticCard heading={'Avl. books'} data={statistics.totalAvlBookTitles} icon={<BooksIcon size={30} />} />

        <StatisticCard heading={'Registered users'} data={statistics.totalUsers} icon={<GroupIcon size={30} />} />
        <StatisticCard heading={'Active users'} data={statistics.totalActiveUsers} icon={<GroupIcon size={30} />} />
        <StatisticCard heading={'Users in library'} data={statistics.totalUsersInLibrary} icon={<GroupIcon size={30} />} />

      </div>
    </div>
  )
}

export default DashboardHOC(
  Dashboard,
)