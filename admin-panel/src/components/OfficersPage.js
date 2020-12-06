import React, { useState, useEffect } from 'react'
import axios from 'axios';
import OfficersTable from './OfficersTable.js';
import { Button } from 'react-bootstrap'

export default function OfficersPage() {

    const [officers, setOfficers] = useState(null)

    useEffect(() => {
        axios
            .get("/api/officers")
            .then((officers) => setOfficers(officers.data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div style={{ }}>
            <div style={{ float: 'right', padding: 20}}>
                <Button variant="success">
                    Add
                </Button>
            </div>
            {officers === null ? (
                <p>Loading...</p>
            ) : (
                    <OfficersTable data={officers} />
                )}
        </div>
    )
}