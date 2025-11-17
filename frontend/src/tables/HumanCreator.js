import React, {useEffect, useMemo, useState} from 'react';
import './humanCreator.css';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import humanService from "../services/HumanService";
import "../util/pagination.css"
import {useError} from "../util/ErrorContext";
import editIcon from "../imgs/edit-icon.png";
import deleteIcon from "../imgs/delete-icon.png";
import {useNavigate} from "react-router-dom";
import cityService from "../services/CityService";

const HumanCreator = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        content: [],
        totalElements: 0,
        totalPages: 0
    });
    const [name, setName] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });
    const {showError, showNotification} = useError();
    const [cityData, setCityData] = useState([])
    const [curId, setCurId] = useState(0)
    const [humans, setHumans] = useState([])
    const [cityDataVisible, setCityDataVisible] = useState(false);

    const callServer = async () => {
        let sortBy = 'id';
        let sortOrder = 'asc';

        if (sorting.length > 0) {
            sortBy = sorting[0].id;
            sortOrder = sorting[0].desc ? 'desc' : 'asc';
        }

        await humanService.getHumans(
            pagination.pageIndex,
            pagination.pageSize,
            sortBy,
            sortOrder
        )
            .then(data => {
                setData(data)
            })
            .catch(err => {
                showError(err.toString());
            });
    }
    const getAllHumans = async () => {
        let sortBy = 'id';
        let sortOrder = 'asc';


        await humanService.getHumans(
            0,
            10000000,
            sortBy,
            sortOrder
        )
            .then(data => {
                setHumans(data.content);
            })
            .catch(err => {
                showError(err.toString());
            });
    }
    useEffect(() => {
        callServer()
        getAllHumans()
        const intervalId = setInterval(()=>{callServer(); getAllHumans()}, 5000);

        return () => clearInterval(intervalId);
    }, [pagination.pageIndex, pagination.pageSize, sorting])

    const addHuman = async () => {
        if (name.trim() === '') {
            showError('Имя человека должно быть не пустой строкой')
            return;
        }

        try {
            await humanService.addHuman({name: name});
            await callServer()
            showNotification("Человек успешно добавлен")
        } catch (err) {
            showError(err.toString());
            return;
        }
        setName('');
    }

    const handleDelete = async (humanId) => {
        try {
            humanService.getCitiesByHuman(humanId).then(data => {
                if(data.length===0){
                    humanService.deleteHuman(humanId);
                    showNotification('Человек успешно удален');
                    setCityData([])
                    setCityDataVisible(false)
                    return;
                }
                    setCurId(humanId)
                    setCityData(data)
                    setCityDataVisible(true)
                }
            ).catch(e =>
                showError(e.message)
            )
            callServer();

        } catch (err) {
            showError('Ошибка при удалении города: ' + err.toString());
        }
    };

    const handleEdit = (human) => {
        navigate('/edit-human', {
            state: {
                human: human,
            }
        });
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: info => parseInt(info.getValue()),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: info => info.getValue(),
            },
            {
                id: 'actions',
                header: 'Действия',
                cell: ({row}) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="edit-button"
                            title="Редактировать"
                        >
                            <img
                                src={editIcon}
                                alt="Edit"
                                className="action-icon"
                            />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="delete-button"
                            title="Удалить"
                        >
                            <img
                                src={deleteIcon}
                                alt="Edit"
                                className="action-icon"
                            />
                        </button>
                    </div>
                ),
                enableSorting: false,
            },

        ], []);
    const table = useReactTable({
        data: data.content,
        columns,
        state: {
            sorting,
            pagination
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: data.totalPages || 0,
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
                    }}
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
                                style={{cursor: 'pointer'}}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                {header.column.getIsSorted() === 'asc' ? '↑' :
                                    header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
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
            {cityDataVisible && <div className="creator">
                В процессе попытки удаления Человека с id:{curId} возникли вопросы к зависимым городам, пожалуйста,
                свяжите нижестоящие города с другими людьми
                {cityData.map(city => {
                    return (
                        <div>
                            ID города: {city.id}, губернатор:
                            <select className="pagination-selector"
                                    value={city.human.id}
                                    onChange={e => {
                                        city.human = humans.find(human => human.id.toString() === e.target.value)
                                        cityService.patchCity(city.id, city)
                                    }}
                                    onClick={() => getAllHumans()}
                            >
                                {humans.map(x => (
                                    <option key={x.id} value={x.id}>
                                        {(x.name)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )

                })}

            </div>};
        </div>
    );

};

export default HumanCreator;