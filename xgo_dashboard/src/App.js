import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from './components/Table';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { API_URL } from './components/config'; // Ensure this is the correct import
import CustomersTable from './components/CustomersTable';
import DriversTable from './components/DriversTable';
import SearchPage from './components/searchPage';
import Billing from './components/Billing';
import AddTopUp from './components/from tellthem/AddTopUp';
import AdminDashboard from './components/from tellthem/AdminDashboard';
import axios from 'axios';
import PendingReg from './components/from tellthem/PendingRegistrations';
import SearchTrip from './components/searchTrip';
import Analytics from './components/Analytics';
import Broadcast from './components/Broadcast';
import Reports from './components/Reports';
import CustomerAdminChat from './components/CustomerAdminChat';
import ChatHome from './components/ChatHome';
import Feedback from './components/feedback';
import AddConfig from './components/AddConfig';
import AppStatistics from './components/AppStatistics';
import ViewConfig from './components/ViewConfig';
import Configurations from './components/Configurations';
import MapView from './components/Location';
import MapViewWithDriver from './components/TripTrack';
import ReportAnalysis from './components/reportAnalysis';

import Home from './components/Home';
import Confirmation from './components/ConfirmPage';
import Map from './components/MapPointer';
import Maps from './components/Maps';

function App() {
    const [tripData, setTripData] = useState([]);
    const [customersData, setCustomersData] = useState([]);
    const [driversData, setDriversData] = useState([]);
    const APILINK = API_URL;

    const getDrivers = async () => {
        try {
            const response = await fetch(`${APILINK}/driver/`);
            const data = await response.json();
            console.log(data);
            setDriversData(data);
        } catch (error) {
            console.log(error);
        }
    };

    const getCustomers = async () => {
        try {
            const response = await axios.get(`${APILINK}/customerdetails/`);
            const data = response.data;
            console.log(data);
            setCustomersData(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchTripData = async () => {
        try {
            const response = await fetch(`${API_URL}/trip/`);
            const data = await response.json();
            setTripData(data);
        } catch (error) {
            console.error('Error fetching trip data:', error);
        }
    };

    useEffect(() => {
        fetchTripData();
        getCustomers();
        getDrivers();
    }, []);

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="/table/trips" element={<Table tripData={tripData} />} />
                    <Route path="/Driverstable/list" element={<DriversTable driversData={driversData} />} />
                    <Route path="/Customerstable/list" element={<CustomersTable customersData={customersData} />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/AddTopUp" element={<AddTopUp />} />
                    <Route path="/Reports" element={<Reports />} />
                    <Route path="/broadcast" element={<Broadcast />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/Admindash" element={<AdminDashboard />} />
                    <Route path="/verifyReg" element={<PendingReg />} />
                    <Route path="/searchTrip" element={<SearchTrip />} />
                    <Route path="/chatNow/:tripId" element={<CustomerAdminChat />} />
                    <Route path="/chatHome" element={<ChatHome />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/AddConfig" element={<AddConfig />} />
                    <Route path="/AppStatistics" element={<AppStatistics />} />
                    <Route path="/ViewConfig" element={<ViewConfig />} />
                    <Route path="/Configurations" element={<Configurations />} />
                    <Route path="/map" element={<MapView />} />
                    <Route path="/mapWithDriver" element={<MapViewWithDriver />} />
                    <Route path="/ReportAnalysis" element={<ReportAnalysis />} />



                    <Route path="/Home" element={<Home />} />
                    <Route path="/Confirmation" element={<Confirmation />} />
                    <Route path="/Map" element={<Map />} />
                    <Route path="/Maps" element={<Maps />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;