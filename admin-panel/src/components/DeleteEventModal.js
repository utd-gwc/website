import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'


export default function DeleteEventModal({ show, setShow, eventInfo }) {

    const { id, name, oldEvent } = eventInfo != null ? eventInfo : {
        id: null,
        name: null,
        oldEvent: null
    }

    const handleClose = () => setShow(false);

    const handleDelete = () => {
        if (id != null) {
            axios
                .delete('https://utd-gwc-api.herokuapp.com/api/events/' + id)
                .then(() => {
                    alert('Event ' + name + ' deleted successfully')
                    handleClose()
                })
                .catch(() => alert('Failed to delete event'))
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Event: {name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this event?</p>
                {oldEvent ? (
                    <p>This is an old event and is safe to delete</p>
                ) : (
                    <p>This event has not yet happened! Double check you want to delete it.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}