
import React, { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import 'bootstrap/dist/css/bootstrap.min.css';
import BTable from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


export default function EventsTable({ data, triggerEventModal, triggerDeleteEventModal }) {

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: '_id',
                Cell: ({ value }) => {
                    return(
                        <div style={{width: 100, overflow: 'auto'}}>
                            {value}
                        </div>
                    )
                }
            },
            {
                Header: 'Title',
                accessor: 'title',
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'Date',
                accessor: 'date',
                Cell: ({ value }) => new Date(value).toLocaleString()
            },
            {
                Header: 'FlyerUrl',
                accessor: 'flyerUrl',
                Cell: ({ value }) => {
                    if (value != null && value !== "") {
                        return (
                            <div>
                                <Zoom>
                                    <img alt="Flyer for GWC event" src={value} style={{ maxWidth: 200 }} />
                                </Zoom>
                                <a href={value} target="_blank" rel="noreferrer">
                                {value}
                                </a>
                            </div>
                        )
                    } else {
                        return null
                    }
                }
            }
        ], []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns, data, initialState: {
            sortBy: [
                {
                    id: 'date',
                    desc: true
                }
            ]
        }
    }, useSortBy)

    return (
        <BTable striped bordered hover {...getTableProps()} >
            <thead style={{ background: 'lavender' }}>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted
                                        ? column.isSortedDesc
                                            ? ' 🔽'
                                            : ' 🔼'
                                        : ''}
                                </span>
                            </th>
                        ))}
                        <th>
                            Actions
                        </th>
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    const today = new Date()
                    const eventDate = new Date(row.cells[3].value)
                    const oldEvent = today > eventDate
                    return (
                        <tr {...row.getRowProps()} style={{ background: oldEvent ? 'LightGray' : '' }}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                            <td style={{ align: 'center' }}>
                                <Button variant='outline-primary' style={{ width: 100, marginBottom: 15 }} onClick={() => {triggerEventModal('EDIT', row.cells[0].value)}}>
                                    Edit
                                </Button>
                                <Button variant={oldEvent ? 'warning' : "outline-danger"} style={{ width: 100 }} onClick={() => {triggerDeleteEventModal(row.cells[0].value, row.cells[1].value, oldEvent)}}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </BTable>
    )
}