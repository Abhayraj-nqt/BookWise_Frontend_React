import React, { useState } from 'react'

// Components
import Popup from './Popup'
import Select from '../form/select/Select';
import DatePicker from '../form/date/DatePicker';
import Button from '../button/Button';

// CSS
import './IssuanceFilterPopup.css'

const UserHistoryFilterPopup = ({ onFilter, isOpen, onClose, title }) => {

    const [issueTimeFrom, setIssueTimeFrom] = useState();
    const [issueTimeTo, setIssueTimeTo] = useState();
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    const handleFilter = () => {
        const filterObj = {

        }

        if (issueTimeFrom) {
            filterObj.issueTimeFrom = issueTimeFrom + 'T00:00:00';
        }
        if (issueTimeTo) {
            filterObj.issueTimeTo = issueTimeTo + 'T23:59:00';
        }
        if (status) {
            filterObj.status = status;
        }
        if (type) {
            filterObj.type = type;
        }

        onFilter(filterObj);
    }

    const handleClearFilter = () => {
        setIssueTimeFrom('');
        setIssueTimeTo('');
        setStatus('');
        setType('');
    }

    return (
        <Popup isOpen={isOpen} title={title} onClose={onClose} >

            <div className="filter-select-data">
                <DatePicker label={'Issuance from'} onChange={(e) => setIssueTimeFrom(e.target.value)} value={issueTimeFrom} />
                <DatePicker label={'Issuance to'} onChange={(e) => setIssueTimeTo(e.target.value)} value={issueTimeTo} />
            </div>

            <div className="filter-select-status">
                <Select label={'Select status'} onChange={(e) => setStatus(e.target.value)} value={status} >
                    <option value={''}>All</option>
                    <option value={'Issued'}>Issued</option>
                    <option value={'Returned'}>Returned</option>
                </Select>
            </div>

            <div className="filter-select-type">
                <Select label={'Select issuance type'} onChange={(e) => setType(e.target.value)} value={type} >
                    <option value={''}>All</option>
                    <option value={'In house'}>In house</option>
                    <option value={'Take away'}>Take away</option>
                </Select>
            </div>

            <div className="filter-btn">
                <Button varient='primary' onClick={handleFilter}>Search</Button>
                <Button varient='secondary' onClick={handleClearFilter}>Clear</Button>
            </div>

        </Popup>
    )
}

export default UserHistoryFilterPopup