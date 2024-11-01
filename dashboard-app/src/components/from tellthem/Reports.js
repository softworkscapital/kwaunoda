import React, { useState } from "react";
import { useEffect } from "react";
// import { useNavigation, useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
import { API_URL } from "../config";


const Reports = () => {

    const [topUpList, setTopUpList] = useState([]); // Initialize topUpList as an empty array

    const [isAdmin, setIsAdmin] = useState('');

    useEffect(() => {
        const role = "Admin";
        if (role === 'Admin') {
            setIsAdmin(true);
        }
        if(role === '' || role === null){
            window.location.href = '/';
        }
        const client_profile_id = localStorage.getItem('async_client_profile_id');
        fetch(`${API_URL}/topUp/topup/${client_profile_id}`)
            .then(res => res.json())
            .then(resp => {
                setTopUpList(resp);
            })
            .catch(err => {
                console.log(err.message);
            });
    }, []);
    return (
        <div>
             {/* {isAdmin ? <AdminHeader/> : null} */}
            {/* {isAdmin ? <AdminHeader /> : null}
            {!isAdmin ? <Header /> : null} */}
            <body class="sb-nav-fixed">

                <div id="layoutSidenav">

                    <div id="layoutSidenav_content">
                        <main>
                            <div class="container-fluid px-4">
                                <h1 class="mt-4">Top Up Report</h1>
                                <ol class="breadcrumb mb-4">
                                    <li class="breadcrumb-item active"></li>
                                </ol>
                                <table className="table table-bordered">
                                    <thead className="bg-dark text-light">
                                        <tr>
                                            <td style={{ color: 'white' }}>Date</td>
                                            <td style={{ color: 'white' }}>Details</td>
                                            <td style={{ color: 'white' }}>Dr</td>
                                            <td style={{ color: 'white' }}>Cr</td>
                                            <td style={{ color: 'white' }}>Balance</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            topUpList.map((item) => (
                                                <tr key={item.top_up_id}>
                                                    <td>{item.date}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.debit}</td>
                                                    <td>{item.credit}</td>
                                                    <td>{item.balance}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </div>
                </div>
            </body>
        </div>
    );
}

export default Reports;