import React from 'react'
import Card from './Card'

const StatisticCard = ({heading, data, icon}) => {
    return (
        <Card className={'dash-statistic-card'} >
            <div className="dash-statistic-header">
                {icon && <div className="dash-statistic-icon">
                    {icon}
                </div>}
                {data && <p>{data}</p>}
            </div>
            {heading && <div className='dash-statistic-text'>{heading}</div>}
        </Card>
    )
}

export default StatisticCard