import React, { useEffect, useState } from 'react'

// Components
import DashboardHOC from '../../../components/hoc/dashboardHOC/DashboardHOC'
import StatisticCard from '../../../components/card/StatisticCard';
import { GroupIcon, BooksIcon, CategoryIcon, IssuanceIcon } from '../../../components/icons/Icons'

// CSS
import './Dashboard.css'

// Functions
import { getStatistics } from '../../../api/services/dashboard';
import toast from '../../../components/toast/toast';

const Dashboard = ({setLoading}) => {

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
      setLoading(true)
      const data = await getStatistics();
      setStatistics(data);
    } catch (error) {
      toast.error('Failed to load data!');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='dashboard-page'>
      <div className="lib-details">
    
        <StatisticCard heading={'Total Issuances'} data={statistics.totalIssuance.toString()} icon={<IssuanceIcon size={30} />} />
        <StatisticCard heading={'Active issuances'} data={(statistics.totalActiveInHouseIssuance+statistics.totalActiveTakeAwayIssuance).toString()} icon={<IssuanceIcon size={30} />} />
        <StatisticCard heading={'In house issuances'} data={statistics.totalActiveInHouseIssuance.toString()} icon={<IssuanceIcon size={30} />} />
        <StatisticCard heading={'Take away issuances'} data={statistics.totalActiveTakeAwayIssuance.toString()} icon={<IssuanceIcon size={30} />} />

        <StatisticCard heading={'Categories'} data={statistics.totalCategories.toString()} icon={<CategoryIcon size={30} />} />

        <StatisticCard heading={'Total books'} data={statistics.totalBooks.toString()} icon={<BooksIcon size={30} />} />
        <StatisticCard heading={'Available books'} data={statistics.avlBooks.toString()} icon={<BooksIcon size={30} />} />
        <StatisticCard heading={'Book types'} data={statistics.totalBookTitles.toString()} icon={<BooksIcon size={30} />} />
        {/* <StatisticCard heading={'Avl. books'} data={statistics.totalAvlBookTitles} icon={<BooksIcon size={30} />} /> */}

        <StatisticCard heading={'Registered users'} data={statistics.totalUsers.toString()} icon={<GroupIcon size={30} />} />
        <StatisticCard heading={'Active users'} data={statistics.totalActiveUsers.toString()} icon={<GroupIcon size={30} />} />
        <StatisticCard heading={'Users in library'} data={statistics.totalUsersInLibrary.toString()} icon={<GroupIcon size={30} />} />

      </div>
    </div>
  )
}

export default DashboardHOC(
  Dashboard,
)