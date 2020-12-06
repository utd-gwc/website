import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
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
    console.log(eachEntry)
    if (eachEntry.name === null || eachEntry.name === '') {
        return false;
    } else if (eachEntry.profilePhotoUrl === null || eachEntry.profilePhotoUrl === '' || (!validURL(eachEntry.profilePhotoUrl) && !isImageUrl(eachEntry.profilePhotoUrl))) {
        console.log(eachEntry.profilePhotoUrl === null || eachEntry.profilePhotoUrl === '' || (!validURL(eachEntry.profilePhotoUrl) && !isImageUrl(eachEntry.profilePhotoUrl)))
        console.log(eachEntry.profilePhotoUrl === null)
        console.log(eachEntry.profilePhotoUrl === '')
        console.log(!validURL(eachEntry.profilePhotoUrl) && !isImageUrl(eachEntry.profilePhotoUrl))
        console.log(!validURL(eachEntry.profilePhotoUrl));
        console.log(!isImageUrl(eachEntry.profilePhotoUrl));
        return false;
    } else if (eachEntry.position === null || eachEntry.position === '') {
        return false;
    } else {
        return true;
    }
}

export default function OfficersModal({ show, setShow, type, id }) {

    const initialInputState = useMemo(() => {
        return {
            name: "",
            bio: "",
            profilePhotoUrl: "",
            position: "",
            externalLinks: {},
        }
    }, [])

    const [eachEntry, setEachEntry] = useState(initialInputState);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (type === 'EDIT' && id !== null) {
            fetch("https://utd-gwc-api.herokuapp.com/api/officers/" + id)
                .then(res => res.json())
                .then((officer) => setEachEntry(officer))
                .catch((err) => console.log(err));
        } else if (type === 'ADD') {
            setEachEntry(initialInputState)
        }
    }, [type, id, initialInputState])

    const { name, bio, position, profilePhotoUrl } = eachEntry

    const handleInputChange = e => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    }

    const handleClose = () => {
        setValidated(false)
        setShow(false)
    };

    const handleFinalSubmit = e => {
        const valid = validateInput(eachEntry);

        if (!valid) {
            alert('Make sure all required fields are filled and correct.')
            setValidated(true)
        } else {
            if (type === 'ADD') {
                fetch('https://utd-gwc-api.herokuapp.com/api/officers', {
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
                fetch('https://utd-gwc-api.herokuapp.com/api/officers/' + id, {
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
                            setValidated(false)
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
                <Modal.Title>{type === 'EDIT' ? 'Edit Officer' : 'Add New Officer'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form validated={validated}>
                    <Form.Group>
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <Form.Control required name="name" placeholder="First Last" onChange={handleInputChange} value={name} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="bio">Bio</Form.Label>
                        <Form.Control name="bio" placeholder="Enter officer bio..." as='textarea' onChange={handleInputChange} value={bio} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="position">Position</Form.Label>
                        <Form.Control required name="position" placeholder="Ex: Vice President" onChange={handleInputChange} value={position} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="profilePhoto">Photo URL</Form.Label>
                        <Form.Control required isValid={validURL(profilePhotoUrl) || isImageUrl(profilePhotoUrl)} name="profilePhotoUrl" placeholder="Ex: https://imageUrl.com/headshot.jpg" onChange={handleInputChange} value={profilePhotoUrl} />
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