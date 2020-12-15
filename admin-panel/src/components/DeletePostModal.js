import React from 'react'
import { Modal, Button } from 'react-bootstrap'


export default function DeleteEventModal({ show, setShow, postID, postURL, refetchData }) {


    const handleClose = () => setShow(false);

    const handleDelete = () => {
        if (postID != null) {
            fetch('https://utd-gwc-api.herokuapp.com/api/posts/' + postID, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then((res) => {
                    if (!res.message) {
                        console.log(res)
                        alert('Error Deleting!')
                    } else {
                        alert('Success!')
                        refetchData()
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
                <Modal.Title>Delete <a href={postURL} target="_blank" rel="noreferrer">{postURL}</a></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete this post from our db?</p>
                <p>It will no longer appear in the feed on our website.</p>
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