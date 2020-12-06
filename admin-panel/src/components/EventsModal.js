import React, { useState, useEffect } from 'react'
import { Modal, Button, Form} from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker';
import isImageUrl from 'is-image-url'
import axios from 'axios'

function validateInput(eachEntry) {
    if(eachEntry.title == null || eachEntry.title === '') {
        return false;
    } else if(eachEntry.description == null || eachEntry.description === '') {
        return false;
    } else if(eachEntry.date == null) {
        return false;
    } else {
        return true;
    }
}

export default function EventsModal({ show, setShow, type, id }) {

    const initialInputState = {
        title: "",
        description: "",
        date: null,
        flyerUrl: "",
    }

    const [eachEntry, setEachEntry] = useState(initialInputState);
    const [validated, setValidated] = useState(false);
    const [validImage, setValidImage] = useState(true);


    useEffect(() => {
        if(type === 'EDIT' && id != null) {
            axios
                .get("/api/events/"+id)
                .then((events) => {
                    setEachEntry(events.data)
                })
                .catch((err) => console.log(err));
        }
    }, [type, id])

    const { title, description, date, flyerUrl } = eachEntry

    

    const handleInputChange = e => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    }
    const handleDateChange = value => {
        setEachEntry({...eachEntry, date: value})
    }

    const handleClose = () => setShow(false);

    const handleFinalSubmit = e => {
        if(flyerUrl !== '') {
            setValidImage(isImageUrl(flyerUrl))
        } else {
            setValidImage(true)
        }
        const valid = validateInput(eachEntry) && validImage;


        if(!valid) {
            alert('Make sure all required fields are filled.')
            setValidated(true)
        } else {
            if(type === 'ADD') {
                axios
                    .post('https://utd-gwc-api.herokuapp.com/api/events', eachEntry)
                    .then(() => alert('Success!'))
                    .then(() => {
                        setValidated(false)
                        setEachEntry(initialInputState)
                        handleClose()
                    })
                    .catch(() => {
                        setValidated(true)
                        alert('Error posting')
                    })
            } else if(type === 'EDIT') {
                axios
                    .put('https://utd-gwc-api.herokuapp.com/api/events/'+id, eachEntry)
                    .then(() => {alert('Success!')})
                    .then(() => {
                        setValidated(false)
                        setEachEntry(initialInputState)
                        handleClose()
                    })
                    .catch(() => {
                        setValidated(true)
                        alert('Error updating!')
                    })
            }
        }
        // handleClose()
    }

    console.log(eachEntry);
    console.log(validImage);

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
                        <Form.Label htmlFor="flyerLink">Flyer URL</Form.Label>
                        <Form.Control name="flyerUrl" placeholder="Ex: https://imageUrl.com" onChange={handleInputChange} value={flyerUrl} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="date">Date</Form.Label><br/>
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