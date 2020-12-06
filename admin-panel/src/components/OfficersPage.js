import React, { useState, useEffect } from 'react'
import OfficersTable from './OfficersTable.js';
import { Button } from 'react-bootstrap';
import OfficersModal from './OfficersModal';
import DeleteOfficerModal from './DeleteOfficerModal';

export default function OfficersPage() {

    const [officers, setOfficers] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteModalInfo, setDeleteModalInfo] = useState({ id: null, name: null });
    const [modalType, setModalType] = useState('ADD');
    const [modalID, setModalID] = useState(null);
    const [showRawData, setShowRawData] = useState(false);

    function triggerOfficerModal(type, id) {
        setModalType(type);
        if (type === 'ADD' && modalID != null) {
            setModalID(null);
        } else if (type !== 'ADD') {
            setModalID(id)
        }
        setShowModal(true);
    }

    function triggerDeleteOfficerModal(id, name) {
        // setModalID(id)
        setDeleteModalInfo({ id, name })
        setShowDeleteModal(true);
    }

    useEffect(() => {
        fetch("https://utd-gwc-api.herokuapp.com/api/officers")
            .then(res => res.json())
            .then((officers) => setOfficers(officers))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div style={{}}>
            <div style={{ float: 'right', padding: 20 }}>
                <Button variant="secondary" onClick={() => { setShowRawData(!showRawData) }} style={{ marginRight: 20 }}>
                    {showRawData ? 'View Table' : 'View Raw'}
                </Button>
                <Button variant="success" onClick={() => { triggerOfficerModal('ADD') }}>
                    Add
                </Button>
            </div>
            {officers === null ? (
                <p>Loading...</p>
            ) : showRawData ?
                    (
                        <div><pre>{JSON.stringify(officers, null, 2)}</pre></div>
                    ) :
                    (
                        <OfficersTable data={officers} triggerOfficerModal={triggerOfficerModal} triggerDeleteOfficerModal={triggerDeleteOfficerModal} />
                    )
            }
            <OfficersModal show={showModal} setShow={setShowModal} type={modalType} id={modalID} />
            <DeleteOfficerModal show={showDeleteModal} setShow={setShowDeleteModal} officerID={deleteModalInfo.id} officerName={deleteModalInfo.name} />
        </div>
    )
}