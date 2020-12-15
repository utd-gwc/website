import React, { useState, useMemo } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

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
    if (eachEntry.postURL == null || eachEntry.postURL.trim() === "" || !validURL(eachEntry.postURL)) {
        return false
    } else {
        return true;
    }
}

export default function PostsModal({ show, setShow, refetchData }) {

    const initialInputState = useMemo(() => {
        return {
            postURL: "",
        }
    }, [])

    const [eachEntry, setEachEntry] = useState(initialInputState);
    const [validated, setValidated] = useState(false);

    const { postURL } = eachEntry

    const handleInputChange = e => {
        setEachEntry({ ...eachEntry, [e.target.name]: e.target.value });
    }

    const handleClose = () => {
        setEachEntry(initialInputState)
        setValidated(false)
        setShow(false)
    };


    function getJSON(body) {
        try {
            var data = body.split("window._sharedData = ")[1].split("</script>")[0];
            return JSON.parse(data.substr(0, data.length - 1));
        } catch (err) {
            throw Error("cannot parse response body");
        }
    };

    function mapPostMedia(json) {
        try {
            var _url = function _url(node) {
                return "https://www.instagram.com/p/" + node.shortcode;
            };

            var _src = function src(node) {
                switch (node.__typename) {
                    case "GraphVideo":
                        return node.thumbnail_src;

                    case "GraphSidecar":
                    default:
                        return node.display_url;
                }
            };

            var _alt = function alt(node) {
                if (node.edge_media_to_caption.edges[0] && node.edge_media_to_caption.edges[0].node) {
                    return node.edge_media_to_caption.edges[0].node.text;
                } else if (node.accessibility_caption) {
                    return node.accessibility_caption;
                } else {
                    return "";
                }
            };

            var _posted = function posted(node) {
                return new Date(node.taken_at_timestamp * 1000).toString()
            }

            var node = json.entry_data.PostPage[0].graphql.shortcode_media;
            return {
                alt: _alt(node),
                url: _url(node),
                src: _src(node),
                posted: _posted(node),
            }
        } catch (err) {
            throw Error("cannot map media array");
        }
    };

    const addPost = (post) => {
        fetch('https://utd-gwc-api.herokuapp.com/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
            .then(res => res.json())
            .then((res) => {
                if (!res._id) {
                    console.log(res)
                    alert('Error posting')
                    setValidated(true)
                } else {
                    refetchData()
                    alert('Success!')
                    handleClose()
                }
            })
            .catch((err) => {
                console.log(err)
                alert('Error posting')
                setValidated(true)
            })
    }

    async function handleFinalSubmit(e) {
        const valid = validateInput(eachEntry);

        if (!valid) {
            alert('Make sure all required fields are filled and correct.')
            setValidated(true)
        } else {
            try {
                const res = await fetch(eachEntry.postURL, {
                    method: "GET",
                });
                console.log(res);
                const body = await res.text();
                console.log(body);
                const json = await getJSON(body);
                console.log(json);
                const media = mapPostMedia(json);
                console.log(media);
                addPost(media);
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form validated={validated}>
                    <Form.Group>
                        <Form.Label htmlFor="postURL">Post URL</Form.Label>
                        <Form.Control isValid={validURL(postURL)} required name="postURL" placeholder="Enter Insta post URL (Ex: https://www.instagram.com/p/CG-scg2B5Bw/)" onChange={handleInputChange} value={postURL} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleFinalSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
}