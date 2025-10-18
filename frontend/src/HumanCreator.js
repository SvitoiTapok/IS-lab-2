import React, {useState, useMemo} from 'react';
import './humanCreator.css';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import CustomError from "./error";

const HumanCreator = () => {
    const [humans, setHumans] = useState([]);
    const [name, setName] = useState('');
    const [sorting, setSorting] = useState([]);
    const [error, setError] = useState('')
    const [errorVisible, setErrorVisible] = useState(false)

    const showError = (errorMessage) => {
        setError(errorMessage);
        if (errorVisible) {
            return;
        }
        setErrorVisible(true);

        setTimeout(() => {
            setErrorVisible(false);
        }, 3000);
    };

    const addHuman = () => {
        if (name.trim() === '') {
            showError('Имя пользователя должно быть не пустой строкой')
            return;
        }
        setHumans([...humans, {name: name}]);
        setName('');
        setError('');

    }
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                cell: info => info.getValue(),
            }], []);
    const table = useReactTable({
        data: humans,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    return (
        <div className="creator">

            <span>
                Люди
            </span>
            <div className="input-group">
                <input
                    placeholder="Имя человека"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                    }
                    }
                    onKeyPress={(e) => {

                        if (e.key === 'Enter') {
                            addHuman();
                        }
                    }}
                    className="name-input"/>
                <button onClick={() => {
                    addHuman()
                }}
                className="create-button">
                    Добавить человека
                </button>
            </div>
            <table className="w-full">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                className="text-left border"
                                onClick={header.column.getToggleSortingHandler()}
                                style={{cursor: 'pointer'}}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                <button className="sort-button" onClick={header.column.getToggleSortingHandler()}>↕
                                </button>
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
            {error && <CustomError value={error} isVisible={errorVisible}/>
            }
        </div>

    );
};

export default HumanCreator;