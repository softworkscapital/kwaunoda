import React, { useState, useEffect } from "react";
import Header from "../Header"
import { API_URL } from '../config';
import "../../css/App.css"
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
    
    const [account_type, setAccount_type] = useState()
    const [account_category, setAccount_category] = useState()
    const [signed_on, setSigned_on] = useState()
    const [name, setName] = useState()
    const [hseNo, setHseNo] = useState()
    const [surbub, setSurbub] = useState()
    const [city, setCity] = useState()
    const [country, setCountry] = useState()
    const [email, setEmail] = useState()
    const [membershipstatus, setMembershipStatus] = useState()
    const [topUpList, setTopUpList] = useState([]);
    const [isAdmin, setIsAdmin] = useState('');
    const [usage, setUsage] = useState('0');

    useEffect(() => {
    }, [])

    useEffect(() => {
        const role = "Admin";
        if (role === 'Admin') {
            setIsAdmin(true);
        }
        if(role === '' || role === null){
            window.location.href = '/';
        }

        const client_profile_id = localStorage.getItem('async_client_profile_id');
        fetch(`${API_URL}/topUp`)
            .then(res => res.json())
            .then(resp => {
                setTopUpList(resp.results);
            })
            .catch(err => {
                console.log(err.message);
            });

    }, [])


    useEffect(() => {
        getBalance();
        getClientDetails();
    })

    const [balance, setBalance] = useState('0');
    const async_client_profile_id = localStorage.getItem('async_client_profile_id');

    const getBalance = () => {

        fetch(`${API_URL}/topUp/adminbal`).then(res => {
            return res.json()
        }).then(resp => {
            setBalance(resp.results[0].total_balance);
            setUsage(resp.results[0].total_usage);
            console.log(resp.results[0].total_balance);
        }).catch((err) => {
            console.log(err.message);
        })
    }


    const getClientDetails = () => {
        fetch(`${API_URL}/clients/${async_client_profile_id}`).then(res => {
            return res.json()
        }).then(resp => {
            setName(resp[0].name);
            setAccount_type(resp[0].account_type);
            setAccount_category(resp[0].account_category);
            setSigned_on(resp[0].signed_on);
            setCountry(resp[0].country);
            setEmail(resp[0].email);
            setMembershipStatus(resp[0].membershipstatus);
            setHseNo(resp[0].house_number_and_street_name);
            setSurbub(resp[0].surbub);
            setCity(resp[0].city)
            console.log(resp[0].name);
        }).catch((err) => {
            console.log(err.message);
        })
    }

    return (
        <div>
            {/* {isAdmin ? <AdminHeader /> : null} */}
            {/* {!isAdmin ? <Header /> : null} */}
            <Navbar/>
            <body class="sb-nav-fixed">

                <div id="layoutSidenav">
                    
                    <div id="layoutSidenav_content">
                        <main>
                            <div class="container-fluid px-4">
                                <h1 class="mt-4">Admin Dashboard</h1>
                                <ol class="breadcrumb mb-4">
                                    <li class="breadcrumb-item active">Dashboard</li>
                                </ol>
                                <div class="row">
                                    <div class="col-xl-3 col-md-6">
                                        <div class="card bg-success text-white mb-4">
                                            <h5>$ {balance+ usage}</h5>
                                            <h5>Total Balances</h5>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-md-6">
                                        <div class="card bg-success text-white mb-4">
                                            <h5>$ {usage}</h5>
                                            <h5>Billing Usage</h5>
                                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-md-6">
                                        <div class="card bg-success text-white mb-4">
                                            <h5>$ {balance}</h5>
                                            <h5>Billing Prepaid</h5>
                                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                        </div>
                                    </div>
                                </div>
                                <table className="table table-bordered">
                                    <thead className="bg-dark text-light">
                                        <tr>
                                            <td style={{ color: 'white' }}>Client ID</td>
                                            <td style={{ color: 'white' }}>Date</td>
                                            <td style={{ color: 'white' }}>Details</td>
                                            <td style={{ color: 'white' }}>Dr</td>
                                            <td style={{ color: 'white' }}>Cr</td>
                                            <td style={{ color: 'white' }}>Balance</td>
                                            {/* <td style={{ color: 'white' }}>Action</td> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            topUpList.map((item) => (
                                                <tr key={item.top_up_id}>
                                                    <td>{item.client_profile_id}</td>
                                                    <td>{item.date}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.debit}</td>
                                                    <td>{item.credit}</td>
                                                    <td>{item.total_balance}</td>
                                                    {/* <td>
                                                        <a href="{EditUser/1" >Edit </a>_
                                                        <a href="/item" >Remove</a>
                                                    </td> */}
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </main>
                        <footer class="py-4 bg-light mt-auto">
                            <div class="container-fluid px-4">
                                <div class="d-flex align-items-center justify-content-between small">
                                    <div class="text-muted">Copyright &copy; Your Website 2023</div>
                                    <div>
                                        <a href="#0">Privacy Policy</a>
                                        &middot;
                                        <a href="#0">Terms &amp; Conditions</a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
                <script src="js/scripts.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
                <script src="assets/demo/chart-area-demo.js"></script>
                <script src="assets/demo/chart-bar-demo.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
                <script src="js/datatables-simple-demo.js"></script>
            </body>

        </div>
    );
}

export default AdminDashboard;