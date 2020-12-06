import React, { useState, useEffect } from 'react'
import EventsTable from './EventsTable';
import EventsModal from './EventsModal';
import DeleteEventModal from './DeleteEventModal';
import { Button } from 'react-bootstrap';

export default function EventsPage() {

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteModalInfo, setDeleteModalInfo] = useState(null);
    const [modalType, setModalType] = useState('ADD');
    const [modalID, setModalID] = useState(null);
    const [events, setEvents] = useState(null);
    const [showRawData, setShowRawData] = useState(false);

    function triggerEventModal(type, id) {
        setModalType(type);
        if (type === 'ADD' && modalID != null) {
            setModalID(null);
        } else if (type !== 'ADD') {
            setModalID(id)
        }
        setShowModal(true);
    }

    function triggerDeleteEventModal(id, name, oldEvent) {
        // setModalID(id)
        setDeleteModalInfo({ id, name, oldEvent })
        setShowDeleteModal(true);
    }

    useEffect(() => {
        fetch("https://utd-gwc-api.herokuapp.com/api/events/")
            .then(res => res.json())
            .then((events) => setEvents(events))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div>
            <div style={{ float: 'right', padding: 20 }}>
                <Button variant="secondary" onClick={() => { setShowRawData(!showRawData) }} style={{ marginRight: 20 }}>
                    {showRawData ? 'View Table' : 'View Raw'}
                </Button>
                <Button variant="success" onClick={() => triggerEventModal('ADD', null)}>
                    Add
                </Button>
            </div>
            {events === null ? (
                <p>Loading...</p>
            ) : showRawData ?
                    (
                        <div><pre>{JSON.stringify(events, null, 2)}</pre></div>
                    ) :
                    (
                        <EventsTable data={events} triggerEventModal={triggerEventModal} triggerDeleteEventModal={triggerDeleteEventModal} />
                    )
            }
            <EventsModal show={showModal} setShow={setShowModal} type={modalType} id={modalID} />
            <DeleteEventModal show={showDeleteModal} setShow={setShowDeleteModal} eventInfo={deleteModalInfo} />
        </div>
    )
}