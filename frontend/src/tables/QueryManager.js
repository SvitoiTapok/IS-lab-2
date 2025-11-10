import React, {useState, useMemo, useEffect} from 'react';
import './humanCreator.css';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import CustomError from "../util/error";
import humanService from "../services/HumanService";
import "../util/pagination.css"
import queryService from "../services/QueryService";
import {wait} from "@testing-library/user-event/dist/utils";


/* global BigInt */
const QueryManager = () => {
    // const [humans, setHumans] = useState([]);
    const [data, setData] = useState({
        content: [],
        totalElements: 0,
        totalPages: 0
    });
    const [metersAbove, setMetersAbove] = useState('');
    const [population, setPopulation] = useState('');
    const [sorting, setSorting] = useState([]);
    const [error, setError] = useState('')
    const [errorVisible, setErrorVisible] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });
    const [response, setResponse] = useState('');
    const [classErr, setClassErr] = useState("error");
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
    const getMetersAbove = () => {
        const met = parseFloat(metersAbove.replace(",","."))
        if(isNaN(met)){
            showError("Значение высоты города над уровнем моря должно быть корректным значением")
            return null;
        }

        return met
    }
    const getPopulation = () => {
        try {
            const met = BigInt(population)
            if(met<1){
                showError("Значение населения города должно быть > 0")
                return null;
            }
            return met
        }catch (e){
            showError("Значение населения должно быть натуральным числом")
            return null;
        }

    }
    const getMACount = async () => {
        const met = getMetersAbove()
        if(!met) return null
        try {
            await queryService.countCitiesAboveSeaLevel(met).then(data => setResponse(data)

            );
            setClassErr("notification")
            showError("Запрос успешно обработан")
            await wait(3000).then(()=>        setClassErr("error"))
        }catch (err){
            showError(err.toString())
            return null;
        }
    }
    const getPCount = async () => {
        const met = getPopulation()
        if(!met) return null
        try {
            await queryService.getCitiesWithPopulationLessThan(met).then(data => setResponse(data)
            );
            setClassErr("notification")
            showError("Запрос успешно обработан")
            await wait(3000).then(()=>        setClassErr("error"))
        }catch (err){
            showError(err.toString())
            return null;
        }
    }
    const cityToString = (city) => {

    }
    return (
        <div className="creator">
            <span>
                Запросы
            </span>
            <table>
                <tbody>
                <tr>
                    <td>Количество городов, значение поля metersAboveSeaLevel которых больше заданного</td>
                    <td><input className="name-input" placeholder="Введите число" value={metersAbove}
                               onChange={e => setMetersAbove(e.target.value)}/></td>
                    <td>
                        <button className="create-button" onClick={getMACount}>Отправить запрос</button>
                    </td>
                </tr>
                <tr>
                    <td>Количество городов, значение поля population которых меньше заданного</td>
                    <td><input className="name-input" placeholder="Введите число" value={population}
                               onChange={e => setPopulation(e.target.value)}/></td>
                    <td>
                        <button className="create-button" onClick={getPCount}>Отправить запрос</button>
                    </td>
                </tr>
                </tbody>
            </table>

            <span>Response: {response}</span>
            {error && <CustomError value={error} classname={classErr} isVisible={errorVisible}/>}
        </div>

    );
};

export default QueryManager;