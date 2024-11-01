import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import axios from "axios";

const SideBar = () => {
    const [isAdmin, setIsAdmin] = useState('');

    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

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
        <div>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <title>Concept - Bootstrap 4 Admin Dashboard Template</title>
                <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css" />
                <link href="../assets/vendor/fonts/circular-std/style.css" rel="stylesheet" />
                <link rel="stylesheet" href="../assets/libs/css/style.css" />
                <link rel="stylesheet" href="../assets/vendor/fonts/fontawesome/css/fontawesome-all.css" />
            </head>
            <body>
                <div class="nav-left-sidebar sidebar-dark" style={{fontSize: '10px', backgroundColor: '#FFD700', textAlign: 'left'}}>
                    <div class="menu-list">

                        <nav className="navbar navbar-expand-lg navbar-light">
                            {/* <a className="d-xl-none d-lg-none" href="0">Finance Dashboard</a> */}
                            <button className="navbar-toggler" type="button" onClick={toggleMenu} aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className={`collapse navbar-collapse${isMenuOpen ? ' show' : ''}`}>
                                <ul className="navbar-nav flex-column">
                                    <li className="">
                                        <a className="nav-link" href="#" style={{fontSize: '24px',  color: 'black', textAlign: 'left', fontWeight: 'bold'}}>MENU </a>
                                    </li>
                                    <li className="nav-item">
                                        {/* <a className="nav-link active" href="findashboard" style={{fontSize: '12px'}}   >Dashboard <span className="badge badge-success">6</span></a> */}
                                        <a className="nav-link" href="/dash" style={{fontSize: '14px',  color: 'black' }}   >DASHBOARD <span className="badge badge-success">6</span></a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/Customerstable/list" style={{fontSize: '14px', color:'black'}}> CUSTOMERS</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/Driverstable/list" style={{fontSize: '14px', color:'black'}}>DRIVERS</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/table/trips" style={{fontSize: '14px', color:'black'}}>TRIPS</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/Admindash" style={{fontSize: '14px', color:'black'}}>BILLING</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#" style={{fontSize: '14px', color:'black'}}>FEEDBACK</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/verifyReg" style={{fontSize: '14px', color:'black'}}>PENDING REGISTRATION</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/Report" style={{fontSize: '14px', color:'black'}}>REPORT</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/billing" style={{fontSize: '14px', color:'black'}}>ACCOUNT TOP UP</a>
                                    </li>

                                    <li className="nav-item" style={{ marginTop: '130px', color: 'black' }}>
                                        <a style={{ color: 'black' }} className="nav-link" href="#">LOGOUT</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </body>
        </div>
    );
}

export default SideBar;