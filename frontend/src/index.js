import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import MainTable from "./tables/Table";
import HumanCreator from "./tables/HumanCreator";
import CoordCreator from "./tables/CoordCreator";
import {BrowserRouter, Link, NavLink, Route, Routes} from 'react-router-dom';
import './util/navigation.css'
import CityCreator from "./tables/CityCreator";
import CityModificator from "./tables/CityModificator";
import QueryManager from "./tables/QueryManager";
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>

        <BrowserRouter>
            <nav className="navigation">
                <NavLink
                    to="/"
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Main
                </NavLink>
                <NavLink
                    to="/human"
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Human
                </NavLink>
                <NavLink
                    to="/coord"
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Coords
                </NavLink>
                <NavLink
                    to="/city"
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Add New City
                </NavLink>
                <NavLink
                    to="/query"
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                >
                    Query
                </NavLink>
            </nav>
            <Routes>
                <Route path="/" element={<MainTable />} />
                <Route path="/human" element={<HumanCreator />} />
                <Route path="/coord" element={<CoordCreator />} />
                <Route path="/city" element={<CityCreator />} />
                <Route path="/edit-city" element={<CityModificator />} />
                <Route path="/query" element={<QueryManager/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
