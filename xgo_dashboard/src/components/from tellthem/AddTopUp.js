import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import "./public/css/styles.css";


const AddTopUp = () => {

    const [currency, setCurrency] = useState('');
    const [exchange_rate, setExchange_rate] = useState();
    const [date, setDate] = useState('');
    const [credit, setCredit] = useState();
    const [debit, setDebit] = useState();
    const [balance, setBalance] = useState(1);
    const [description, setDescription] = useState();
    const [client_profile_id, setClient_profile_id] = useState();
    const [isAdmin, setIsAdmin] = useState('');

    useEffect(() => {
        const role = "Admin";
        if (role === 'Admin') {
            setIsAdmin(true);
        }
        if(role === '' || role === null){
            window.location.href = '/';
        }
    }, [])

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const userObj = { currency, exchange_rate, date, credit, debit, balance, description, client_profile_id };
        console.log(userObj);

        fetch(`${API_URL}/TopUp`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(userObj)

        }).then(res => {
            console.log(res)
            if (res.status === 200) {
                Swal.fire({                                            
                    text: "saved successfully!",
                    icon: "success"
                  });
                navigate('/Topup')
            }

        }).catch((err) => {
            console.log(err.message)
        })
    }

    return (
        <html>
            {/* {isAdmin ? <AdminHeader /> : null} */}
            {/* {!isAdmin ? <Header /> : null} */}

            <body class="sb-nav-fixed">

                <div id="layoutSidenav">

                    <div id="layoutSidenav_content">
                        <main>
                            <div class="container-fluid px-4">
                                {/* <h1 class="mt-4">Create User</h1> */}
                                <ol class="breadcrumb mb-4">
                                    <li class="breadcrumb-item active"></li>
                                </ol>
                                <form className="container" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="offset-lg-3 col-lg-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h2>Top Up Account</h2>
                                                </div>
                                                <div className="card-body">
                                                    <div className="form-group">
                                                        <label style={{ float: "left" }}>Currency</label> <br></br>
                                                        <input type="text" value={currency} onChange={e => setCurrency(e.target.value)} className="form-control" /><br></br>
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ float: "left" }}>Exchange Rate</label> <br></br>
                                                        <input type="text" value={exchange_rate} onChange={e => setExchange_rate(e.target.value)} className="form-control" /><br></br>
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ float: "left" }}>Date</label> <br></br>
                                                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-control" /><br></br>
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ float: "left" }}>Credit</label> <br></br>
                                                        <input type="number" value={credit} onChange={e => setCredit(e.target.value)} className="form-control" /><br></br>
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ float: "left" }}>Debit</label> <br></br>
                                                        <input type="number" value={debit} onChange={e => setDebit(e.target.value)} className="form-control" /><br></br>
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ float: "left" }}>Balance</label> <br></br>
                                                        <input type="number" value={balance} onChange={e => setBalance(e.target.value)} className="form-control" /><br></br>
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ float: "left" }}>Description</label> <br></br>
                                                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="form-control" /><br></br>
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ float: "left" }}>Client ID</label> <br></br>
                                                        <input type="text" value={client_profile_id} onChange={e => setClient_profile_id(e.target.value)} className="form-control" /><br></br>
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <button type="submit" className="btn btn-success" style={{ float: "left" }}>Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}

export default AddTopUp;