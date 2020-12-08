import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker';
import isImageUrl from 'is-image-url'

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function validateInput(eachEntry) {
    if (eachEntry.title === null || eachEntry.title === '') {
        return false;
    } else if (eachEntry.description === null || eachEntry.description === '') {
        return false;
    } else if (eachEntry.date === null) {
        return false;
    } else if (eachEntry.flyerUrl != null && eachEntry.flyerUrl !== "" && !(validURL(eachEntry.flyerUrl) || isImageUrl(eachEntry.flyerUrl))) {
        return false;
    } else {
        return true;
    }
}

export default function EventsModal({ show, setShow, type, id, refetchData }) {

    const initialInputState = useMemo(() => {
        return {
            title: "",
            description: "",
            date: null,
            flyerUrl: "",
        }
    }, [])

    const [eachEntry, setEachEntry] = useState(initialInputState);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (type === 'EDIT' && id != null) {
            fetch("https://utd-gwc-api.herokuapp.com/api/events/" + id)
                .then(res => res.json())
                .then((event) => {
                    setEachEntry({
                        title: event.title,
                        description: event.description,
                        date: new Date(event.date),
                        flyerUrl: event.flyerUrl,
                    })
                })
                .catch((err) => console.log(err));
        } else if (type === 'ADD') {
            setEachEntry(initialInputState)
        }
    }, [type, id, initialInputState])

    const { title, description, date, flyerUrl } = eachEntry



    const handleInputChange = e => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    }
    const handleDateChange = value => {
        setEachEntry({ ...eachEntry, date: value })
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    };

    const handleFinalSubmit = e => {
        const valid = validateInput(eachEntry)

        if (!valid) {
            alert('Make sure all required fields are filled.')
            setValidated(true)
        } else {
            if (type === 'ADD') {
                fetch('https://utd-gwc-api.herokuapp.com/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(eachEntry)
                })
                    .then(res => res.json())
                    .then((res) => {
                        if (!res._id) {
                            setValidated(true)
                            console.log(res)
                            alert('Error posting')
                        } else {
                            alert('Success!')
                            refetchData()
                            setValidated(false)
                            setEachEntry(initialInputState)
                            handleClose()
                        }
                    })
                    .catch((err) => {
                        setValidated(true)
                        console.log(err)
                        alert('Error posting')
                    })
            } else if (type === 'EDIT') {
                fetch('https://utd-gwc-api.herokuapp.com/api/events/' + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(eachEntry)
                })
                    .then(res => res.json())
                    .then((res) => {
                        if (!res.message) {
                            setValidated(true)
                            console.log(res)
                            alert('Error updating!')
                        } else {
                            alert('Success!')
                            refetchData()
                            setValidated(false)
                            setEachEntry(initialInputState)
                            handleClose()
                        }
                    })
                    .catch((err) => {
                        setValidated(true)
                        console.log(err)
                        alert('Error updating!')
                    })
            }
        }
        // handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{type === 'EDIT' ? 'Edit Event' : 'Add Event'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form validated={validated}>
                    <Form.Group>
                        <Form.Label htmlFor="title">Title</Form.Label>
                        <Form.Control required name="title" placeholder="Ex: GWC Kickoff" onChange={handleInputChange} value={title} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="description">Description</Form.Label>
                        <Form.Control required name="description" placeholder="Enter event description..." as='textarea' onChange={handleInputChange} value={description} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="flyerUrl">Flyer URL</Form.Label>
                        <Form.Control isValid={isImageUrl(flyerUrl) || validURL(flyerUrl)} name="flyerUrl" placeholder="Ex: https://imageUrl.com" onChange={handleInputChange} value={flyerUrl} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="date">Date</Form.Label><br />
                        <DateTimePicker required name="date" id="datetimepicker" value={date} onChange={handleDateChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleFinalSubmit}>
                    {type === 'EDIT' ? 'Save Changes' : 'Save'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}