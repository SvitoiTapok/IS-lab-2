import React, {useState, useEffect, useMemo} from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import './table.css';
import './pagination.css';

const MainTable = () => {
    const [users, setUsers] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = [
            {
                id: 1,
                name: "Moscow",
                coordinates: "55.7558° N, 37.6173° E",
                creationDate: "1147-04-04T00:00:00.000Z",
                area: 2561,
                population: 12655050,
                establishmentDate: "1147",
                capital: true,
                metersAboveSeaLevel: 156,
                populationDensity: 4942,
                telephoneCode: "+7-495",
                climate: "Humid continental",
                governor: "Sergey Sobyanin"
            },
            {
                id: 2,
                name: "Saint Petersburg",
                coordinates: "59.9343° N, 30.3351° E",
                creationDate: "1703-05-27T00:00:00.000Z",
                area: 1439,
                population: 5384342,
                establishmentDate: "1703",
                capital: false,
                metersAboveSeaLevel: 3,
                populationDensity: 3833,
                telephoneCode: "+7-812",
                climate: "Humid continental",
                governor: "Alexander Beglov"
            },
            {
                id: 3,
                name: "Novosibirsk",
                coordinates: "55.0084° N, 82.9357° E",
                creationDate: "1893-04-30T00:00:00.000Z",
                area: 505,
                population: 1625631,
                establishmentDate: "1893",
                capital: false,
                metersAboveSeaLevel: 177,
                populationDensity: 3219,
                telephoneCode: "+7-383",
                climate: "Humid continental",
                governor: "Anatoly Lokot"
            },
            {
                id: 4,
                name: "Yekaterinburg",
                coordinates: "56.8389° N, 60.6057° E",
                creationDate: "1723-11-18T00:00:00.000Z",
                area: 495,
                population: 1493749,
                establishmentDate: "1723",
                capital: false,
                metersAboveSeaLevel: 237,
                populationDensity: 3018,
                telephoneCode: "+7-343",
                climate: "Humid continental",
                governor: "Alexey Orlov"
            },
            {
                id: 5,
                name: "Kazan",
                coordinates: "55.8304° N, 49.0661° E",
                creationDate: "1005-05-30T00:00:00.000Z",
                area: 425,
                population: 1257391,
                establishmentDate: "1005",
                capital: false,
                metersAboveSeaLevel: 60,
                populationDensity: 2959,
                telephoneCode: "+7-843",
                climate: "Humid continental",
                governor: "Ilsur Metshin"
            },
        ]
        setUsers(data);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: info => info.getValue(),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: true
            },
            {
                accessorKey: 'coordinates',
                header: 'Coordinates',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: false
            },
            {
                accessorKey: 'creationDate',
                header: 'Creation date',
                cell: info => new Date(info.getValue()).toLocaleString(),
                enableColumnFilter: false
            },
            {
                accessorKey: 'area',
                header: 'Area',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: false
            },
            {
                accessorKey: 'population',
                header: 'Population',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: false
            },
            {
                accessorKey: 'establishmentDate',
                header: 'Establishment Date',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: false
            },
            {
                accessorKey: 'capital',
                header: 'Capital',
                cell: info => {if (info.getValue())return  "YES"; else return  "NO"},
                enableSorting: true,
            },
            {
                accessorKey: 'metersAboveSeaLevel',
                header: 'Meters ASL',
                cell: info => info.getValue(),
                enableSorting: true,
            },
            {
                accessorKey: 'populationDensity',
                header: 'population density',
                cell: info => info.getValue(),
                enableSorting: true,
            },
            {
                accessorKey: 'telephoneCode',
                header: 'Telephone code',
                cell: info => info.getValue(),
                enableSorting: true,
            },
            {
                accessorKey: 'climate',
                header: 'Climate',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: true
            },
            {
                accessorKey: 'governor',
                header: 'Governor',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: true
            },


        ],
        []
    );

    const table = useReactTable({
        data: users,
        columns,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="p-2">
            <table className="w-full">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                className="text-left border"
                                // onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                <div className="column-filter">
                                    {header.column.columnDef.enableColumnFilter && <input
                                        type="text"
                                        placeholder={`Filter ${header.column.columnDef.header}`}
                                        value={header.column.getFilterValue()}
                                        onChange={e => header.column.setFilterValue(e.target.value)}
                                        className="filter-input"
                                    />}
                                    <span>
                                    <button className="sort-button" onClick={header.column.getToggleSortingHandler()}>↕</button>
                                </span>
                                </div>


                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="border">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {/*Пагинация*/}
            <div>
                <button className="vectors"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button className="vectors"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button className="vectors"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button className="vectors"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
            </div>
            <span className="page">
                    Страница{' '}
                {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
            </span>

            <select className="pagination-selector"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(parseInt(e.target.value));
                    }}
            >
                {[3, 5, 10].map(x => (
                    <option key={x} value={x}>
                        Показать {x}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MainTable;