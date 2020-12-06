
import React, { useState, useEffect, useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'
import 'bootstrap/dist/css/bootstrap.min.css';
import BTable from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


export default function OfficersTable({ data }) {

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
                    if (value != null) {
                        return (
                            <div>
                                <Zoom>
                                    <img src={value} style={{ maxWidth: 200 }} />
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
                                {externalLinks['GITHUB'] != null &&
                                    <li>
                                        <a href={externalLinks['GITHUB']} target="_blank" rel="noreferrer" >
                                            {externalLinks['GITHUB']}
                                        </a>
                                    </li>
                                }
                                {externalLinks['LINKEDIN'] != null &&
                                    <li>
                                        <a href={externalLinks['LINKEDIN']} target="_blank" rel="noreferrer">
                                            {externalLinks['LINKEDIN']}
                                        </a>
                                    </li>
                                }
                                {externalLinks['INSTAGRAM'] != null &&
                                    <li>
                                        <a href={externalLinks['INSTAGRAM']} target="_blank" rel="noreferrer">
                                            {externalLinks['INSTAGRAM']}
                                        </a>
                                    </li>
                                }
                                {externalLinks['WEBSITE'] != null &&
                                    <li>
                                        <a href={externalLinks['WEBSITE']} target="_blank" rel="noreferrer">
                                            {externalLinks['WEBSITE']}
                                        </a>
                                    </li>
                                }
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
    } = useTable({ columns, data, }, useSortBy)

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
                                <Button variant='outline-primary' style={{ width: 100, marginBottom: 15 }}>
                                    Edit
                                </Button>
                                <Button variant="outline-danger" style={{ width: 100 }}>
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