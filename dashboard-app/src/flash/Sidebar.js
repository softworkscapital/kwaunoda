import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../components/config';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

const Sidebar = () => {
    const APILINK = API_URL;
    const [customersCount, setCustomersCount] = useState(0);
    const [tripsCount, setTripsCount] = useState(0);
    const [driversCount, setDriversCount] = useState(0);

    const getTrips = async() =>{
        try {
            const response = await fetch(`${APILINK}/trip/`);
            const data = await response.json();
            console.log(data);

            setTripsCount(data.length);
        } catch (error) {
            console.log(error);
        }

    }

    const getDrivers = async() =>{
        try {
            const response = await fetch(`${APILINK}/driver/`);
            const data = await response.json();
            console.log(data);

            setDriversCount(data.length);
        } catch (error) {
            console.log(error)
        }

    }

   const getCustomers = async () => {
        try {
            const response = await axios.get(`${APILINK}/customerdetails/`);
            const data = response.data;
            console.log(data);
            setCustomersCount(data.length);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };


    useEffect(() => {
        getDrivers()
        getCustomers();
        getTrips();
      }, []);

      return (
        <div className="sidebar">
            <div className="company-name">.</div>

            
            <Link to="/Customerstable/list" className="card">
                <div className="card-body">Customers<span className="customer-count">{customersCount}</span></div>
            </Link>

            <Link to="/Driverstable/list" className="card">
                <div className="card-body">Drivers<span className="customer-count">{driversCount}</span></div>
            </Link>

             <Link to="/table/trips" className="card">
                <div className="card-body">Trips<span className="customer-count">{tripsCount}</span></div>
            </Link>
            
            <div className="card">
                <div className="card-body">Income</div>
            </div>
            <div className="card">
                <div className="card-body">Feedback</div>
            </div>
        </div>
    );
};

export default Sidebar;