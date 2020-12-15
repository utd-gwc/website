
import React, { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import 'bootstrap/dist/css/bootstrap.min.css';
import BTable from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


export default function OfficersTable({ data, triggerDeletePostModal }) {

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: '_id',
                Cell: ({ value }) => {
                    return (
                        <div style={{ width: 100, overflow: 'auto' }}>
                            {value}
                        </div>
                    )
                }
            },
            {
                Header: 'Post URL',
                accessor: 'url',
                Cell: ({ value }) => {
                    return (
                        <div style={{ width: 100, overflow: 'auto'}}>
                            <a href={value}>
                                {value}
                            </a>
                        </div>
                    )
                }
            },
            {
                Header: 'Image src',
                accessor: 'src',
                Cell: ({ value }) => {
                    if (value != null && value !== "") {
                        return (
                            <div style={{ width: 200, overflow: 'auto' }}>
                                <Zoom>
                                    <img alt="Insta post src url" src={value} style={{ maxWidth: 200 }} />
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
            },
            {
                Header: 'Caption/alt text',
                accessor: 'alt',
                Cell: ({ value }) => {
                    return (
                        <div style={{ maxWidth: 200 }}>
                            <p>{value}</p>
                        </div>
                    )
                }
            },
            {
                Header: 'Posted',
                accessor: 'posted',
                Cell: ({ value }) => new Date(value).toLocaleString(),
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
                    id: 'posted',
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
                    return (
                        <tr {...row.getRowProps()} style={{ background: '' }}>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                )
                            })}
                            <td style={{ align: 'center' }}>
                                <Button variant="outline-danger" style={{ width: 100 }} onClick={() => { triggerDeletePostModal(row.cells[0].value, row.cells[1].value) }}>
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