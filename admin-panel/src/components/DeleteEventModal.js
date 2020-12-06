import React from 'react'
import { Modal, Button } from 'react-bootstrap'


export default function DeleteEventModal({ show, setShow, eventInfo }) {

    const { id, name, oldEvent } = eventInfo != null ? eventInfo : {
        id: null,
        name: null,
        oldEvent: null
    }

    const handleClose = () => setShow(false);

    const handleDelete = () => {
        if (id != null) {
            fetch('https://utd-gwc-api.herokuapp.com/api/events/' + id, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then((res) => {
                    if (!res.message) {
                        console.log(res)
                        alert('Error Deleting!')
                    } else {
                        alert('Success!')
                        handleClose()
                    }
                })
                .catch((err) => {
                    console.log(err)
                    alert('Error Deleting!')
                })
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