import React, { useState, useEffect } from "react";
import { API_URL } from '../../components/config';

const DashboardT = () => {

    const [isAdmin, setIsAdmin] = useState('');
    useEffect(() => {
    }, [])

    // useEffect(() => {
    //     const role = "Admin";
    //     if (role === 'Admin') {
    //         setIsAdmin(true);
    //         window.location.href = '/AdminDashboard';
    //     }
    //     if (role === '' || role === null) {
    //         window.location.href = '/';
    //     }
    // }, [])

    const [account_type, setAccount_type] = useState()
    const [account_category, setAccount_category] = useState()
    const [signed_on, setSigned_on] = useState()
    const [name, setName] = useState()
    const [hseNo, setHseNo] = useState()
    const [surbub, setSurbub] = useState()
    const [city, setCity] = useState()
    // const[phoneno1, setPhoneno1] = useState()
    // const[phoneno2, setPhoneno2] = useState()
    const [country, setCountry] = useState()
    const [email, setEmail] = useState()
    const [membershipstatus, setMembershipStatus] = useState()

    useEffect(() => {
        getBalance();
        getClientDetails();
    })

    const [balance, setBalance] = useState('0');
    const async_client_profile_id = localStorage.getItem('async_client_profile_id');

    const getBalance = () => {

        fetch(`${API_URL}/topUp/lasttopup/${async_client_profile_id}`).then(res => {
            return res.json()
        }).then(resp => {
            setBalance(resp.results[0].balance);
            console.log(resp.results[0].balance);
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

            <body class="sb-nav-fixed">

                <div id="layoutSidenav">

                    <div id="layoutSidenav_content">
                        <main>
                            <div class="container-fluid px-4">
                                <h1 class="mt-4">Dashboard</h1>
                                <ol class="breadcrumb mb-4">
                                    <li class="breadcrumb-item active">Dashboard</li>
                                </ol>
                                <div class="row">
                                    <div class="col-xl-3 col-md-6">
                                        <div class="card bg-success text-white mb-4">
                                            <h5>$ {balance}</h5>
                                            <h5>Current Balance</h5>
                                        </div>
                                    </div>
                                    <div class="col-xl-3 col-md-6">
                                        <div class="card bg-success text-white mb-4">
                                            <h5>01/05/2025</h5>
                                            <h5>Account Expiry Date</h5>
                                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xl-6">
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                <i class="fas fa-chart-area me-1"></i>
                                                Profile Details
                                            </div>
                                            <div class="card-body"><canvas id="myAreaChart" width="100%" height="40"></canvas>
                                                <table class="tbl" style={{textAlign:'left'}}>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>Company Name:</td>
                                                        <td>{name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>Account Type:</td>
                                                        <td>{account_type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>Account Category:</td>
                                                        <td>{account_category}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>Signed on</td>
                                                        <td>{signed_on}</td>
                                                    </tr>
                                                    <tr >
                                                        <td style={{fontWeight:'bold'}}>Country:</td>
                                                        <td>{country}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>Email:</td>
                                                        <td>{email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>Membership State:</td>
                                                        <td>{membershipstatus}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>Address:</td>
                                                        <td>{hseNo}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>Surbub:</td>
                                                        <td>{surbub}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{fontWeight:'bold'}}>City:</td>
                                                        <td>{city}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xl-6">
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                <i class="fas fa-chart-bar me-1"></i>
                                                Last Week Usage
                                            </div>
                                            <div class="card-body"><canvas id="myBarChart" width="100%" height="40"></canvas></div>
                                        </div>
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                <i class="fas fa-chart-bar me-1"></i>
                                                Recharge Details
                                            </div>
                                            <div class="card-body"><canvas id="myBarChart" width="100%" height="40"></canvas></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <footer class="py-4 bg-light mt-auto">
                            <div class="container-fluid px-4">
                                <div class="d-flex align-items-center justify-content-between small">
                                    <div class="text-muted">Copyright &copy; Your Website 2023</div>
                                    <div>
                                        <a href="#0">Privacy Policy</a>
                                        &middot;
                                        <a href="/terms">Terms &amp; Conditions</a>
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

export default DashboardT;