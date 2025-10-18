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

const CoordCreator = () => {
    const [coords, setCoords] = useState([]);
    const [x, setX] = useState('');
    const [y, setY] = useState('');
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

    const addCoord = () => {
        const floatX = parseFloat(x.replace(',','.'));
        if(isNaN(floatX)){
            showError('X должен быть корректным числом с плавающей запятой')
            return;
        }
        const floatY = parseInt(y);
        if(isNaN(floatY)){
            showError('X должен быть корректным числом')
            return;
        }
        if(floatY<=-563){
            showError('Y должен быть больше -563')
            return;
        }
        setCoords([...coords, {x: floatX, y: floatY}]);
        setError('');
        setX('');
        setY('');

    }
    const columns = useMemo(
        () => [
            {
                accessorKey: 'x',
                header: 'X',
                cell: info => info.getValue(),
            },
            {
                accessorKey: 'y',
                header: 'Y',
                cell: info => info.getValue(),
            }
            ], []);
    const table = useReactTable({
        data: coords,
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
                Координаты
            </span>
            <div className="input-group">
                <input
                    placeholder="X"
                    value={x}
                    onChange={(e) => {
                        setX(e.target.value);
                        setError('');
                    }
                    }
                    className="name-input"/>
                <input
                    placeholder="Y"
                    value={y}
                    onChange={(e) => {
                        setY(e.target.value);
                        setError('');
                    }
                    }
                    className="name-input"/>
                <button onClick={() => {
                    addCoord()
                }}
                        className="create-button-coord">
                    Добавить координаты
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

export default CoordCreator;