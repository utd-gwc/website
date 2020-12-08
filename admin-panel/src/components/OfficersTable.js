
import React, { useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import 'bootstrap/dist/css/bootstrap.min.css';
import BTable from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


export default function OfficersTable({ data, triggerOfficerModal, triggerDeleteOfficerModal }) {

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
                Header: 'Order',
                accessor: 'order',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Bio',
                accessor: 'bio',
            },
            {
                Header: 'Position',
                accessor: 'position',
            },
            {
                Header: 'PFP',
                accessor: 'profilePhotoUrl',
                Cell: ({ value }) => {
                    if (value != null && value !== "") {
                        return (
                            <div>
                                <Zoom>
                                    <img alt="GWC Officer headshot" src={value} style={{ maxWidth: 200 }} />
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
                Header: 'Links',
                accessor: 'externalLinks',
                Cell: ({ value }) => {
                    const externalLinks = value
                    if (externalLinks != null) {
                        return (
                            <ul>
                                {Object.keys(externalLinks).map((key, index) => {
                                    return (
                                        <li key={index}>
                                            <a href={externalLinks[key]} target="_blank" rel="noreferrer" >
                                                {externalLinks[key]}
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
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
                    id: 'order',
                    desc: false
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
                                <Button variant='outline-primary' style={{ width: 100, marginBottom: 15 }} onClick={() => { triggerOfficerModal('EDIT', row.cells[0].value) }}>
                                    Edit
                                </Button>
                                <Button variant="outline-danger" style={{ width: 100 }} onClick={() => { triggerDeleteOfficerModal(row.cells[0].value, row.cells[1].value) }}>
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