import React, { useState, useEffect } from 'react'
import PostsTable from './PostsTable.js';
import { Button } from 'react-bootstrap';
import DeletePostModal from './DeletePostModal.js';
import PostsModal from './PostsModal.js';

export default function OfficersPage() {

    const [posts, setPosts] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteModalInfo, setDeleteModalInfo] = useState({ id: null, name: null });
    const [showRawData, setShowRawData] = useState(false);

    const [refetch, setRefetch] = useState(false);
    const [fetching, setFetching] = useState(false);

    function triggerDeletePostModal(id, url) {
        setDeleteModalInfo({ id, url })
        setShowDeleteModal(true);
    }

    const toggleRefetch = () => {
        setRefetch(!refetch)
    }

    useEffect(() => {
        setFetching(true);
        fetch("https://utd-gwc-api.herokuapp.com/api/posts")
            .then(res => res.json())
            .then((posts) => setPosts(posts))
            .then(() => setFetching(false))
            .catch((err) => { console.log(err); setFetching(false) });
    }, [refetch]);

    return (
        <div>
            <div style={{ float: 'right', padding: 20 }}>
                <Button variant="secondary" onClick={() => { setShowRawData(!showRawData) }} style={{ marginRight: 20 }}>
                    {showRawData ? 'View Table' : 'View Raw'}
                </Button>
                <Button variant="success" onClick={() => {setShowModal(true)}}>
                    Add
                </Button>
            </div>
            {posts === null ? fetching ? (
                <p>Loading...</p>
            ) : (
                    <p>Error fetching data try reloading.</p>
                ) : showRawData ?
                    (
                        <div><pre>{JSON.stringify(posts, null, 2)}</pre></div>
                    ) :
                    (
                        <PostsTable data={posts} triggerDeletePostModal={triggerDeletePostModal} />
                    )
            }
            <PostsModal show={showModal} setShow={setShowModal} refetchData={toggleRefetch} />
            <DeletePostModal show={showDeleteModal} setShow={setShowDeleteModal} postID={deleteModalInfo.id} postURL={deleteModalInfo.url} refetchData={toggleRefetch} />
        </div>
    )
}