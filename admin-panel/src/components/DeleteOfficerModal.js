import React from 'react'
import { Modal, Button } from 'react-bootstrap'


export default function DeleteEventModal({ show, setShow, officerID, officerName }) {


    const handleClose = () => setShow(false);

    const handleDelete = () => {
        if (officerID != null) {
            fetch('https://utd-gwc-api.herokuapp.com/api/officers/' + officerID, {
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
                <Modal.Title>RIP {officerName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this officer?</p>
                <p>This information will be deleted permanently and cannot be recovered.</p>
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