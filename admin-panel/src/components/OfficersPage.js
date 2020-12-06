import React, { useState, useEffect } from 'react'
import OfficersTable from './OfficersTable.js';
import { Button } from 'react-bootstrap'

export default function OfficersPage() {

    const [officers, setOfficers] = useState(null)

    useEffect(() => {
        fetch("https://utd-gwc-api.herokuapp.com/api/officers")
            .then(res => res.json())
            .then((officers) => setOfficers(officers))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div style={{}}>
            <div style={{ float: 'right', padding: 20 }}>
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