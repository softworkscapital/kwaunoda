import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_URL } from '../config';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import "./public/css/styles.css";


const PendingReg = () => {

    const [isAdmin, setIsAdmin] = useState('');
    const [userList, setUserList] = useState([]);
    const [otp, setOtp] = useState(0);
    const navigate = useNavigate();


    //Client Details
    const [account_type, setAccount_type] = useState('Standard');
    const [account_category, setAccount_category] = useState('');
    const [signed_on, setSigned_on] = useState('');
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [surbub, setSurbub] = useState('');
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [phoneno1, setPhoneno1] = useState("");
    const [phoneno2, setPhoneno2] = useState(""); //check
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [payment_style, setPayment_style] = useState("");

    //User Details
    const [company_id, setCompany_id] = useState('0');
    const [branch_id, setBranch_id] = useState('0');
    const [username, setUsername] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Operator');
    const [category, setCategory] = useState("0");
    const [notify, setNotify] = useState("Yes");
    const [activesession, setActivesession] = useState(''); //check
    const [addproperty, setAddproperty] = useState("No");
    const [editproperty, setEditproperty] = useState("No");
    const [approverequests, setApproverequests] = useState("Yes");
    const [delivery, setDelivery] = useState("Yes");
    const [userstatus, setUserStatus] = useState();
    const [client_profile_id, setClient_profile_id] = useState(0);

    // const [validEmail, setValidEmail] = useState(false);
    // const [regId, setRegId] = useState('');

    useEffect(() => {
        const role = "Admin";
        if (role === 'Admin') {
            setIsAdmin(true);
        }
        if (role === '' || role === null) {
            window.location.href = '/';
        }
        fetch(`${API_URL}/selftregistration`).then(res => {
            return res.json()
        }).then(resp => {
            setUserList(resp);
        }).catch((err) => {
            console.log(err.message);
        })

        generateOtp();
    }, []);

    const validate = (email , id) => {
        console.log(email, id)
        try {
             fetch(`${API_URL}/users/user/email/${email}`)
                .then(res => res.json())
                .then(resp => {
                    console.log(resp.length)
                    if (resp.length  === 0) {
                        UpdateStatus(id) 
                    } else {
                        // setValidEmail(false);
                        Swal.fire({                                            
                            text: "This email already in use!",
                            icon: "error"
                          });
                        
                    }
                })
                .catch(err => {
                    console.log(err.message);
                    Swal.fire({                                            
                        text: "Failed to validate email!",
                        icon: "error"
                      });
                });
            // setIsLoaded(true); // Variables have been loaded
        } catch (error) {
            console.log(error);
            Swal.fire({                                            
                text: "Activation failed",
                icon: "error"
              });
        }
    }

    const generateOtp = () => {
        const min = 123456;
        const max = 987987;
        const random = min + (Math.floor(Math.random() * (max - min + 1)));
        console.log('random number: ', random);
        setOtp(random);
    }

    const HandleRemove = (id) => {
        if (window.confirm('Do you want to remove this client?')) {
            fetch(`${API_URL}/selftregistration/${id}`, {
                method: "DELETE"
            }).then(resp => {
                Swal.fire({                                            
                    text: "sucessfully deleted!",
                    icon: "success"
                  });
                navigate(0);
            }).catch((err) => {
                console.log(err.message);
            })
        }
    }

    const UpdateStatus = (id) => {

        const status = 'Active';
        const userObj = { id, status }
        console.log(userObj);

        if (window.confirm('Do you want to activate this client?')) {
            fetch(`${API_URL}/selftregistration/updatestatus/${id}`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(userObj)
            }).then(res => {
                OnActivate(id);
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }

    //Reverse Status Update
    // const ReverseStatus = (id) => {
    //     const status = 'Pending - Email in Use';
    //     const userObj = { id, status }
    //     console.log(userObj);
    //     setRegId(id);

    //     fetch(`${API_URL}/selftregistration/updatestatus/${id}`, {
    //         method: "PUT",
    //         headers: { "content-type": "application/json" },
    //         body: JSON.stringify(userObj)
    //     }).then(res => {
    //         // OnActivate(id);
    //     }).catch((err) => {
    //         console.log(err.message)
    //     })
    // }



    const OnActivate = async (id) => {
        try {
            const resp = await fetch(`${API_URL}/selftregistration/${id}`).then(res => res.json());

            console.log(resp[0]);
            setAccount_type('standard');
            setAccount_category('Corporate');
            setSigned_on('03-06-2024');
            setName(resp[0].company_name);
            setStreet(resp[0].house_number_and_street_name);
            setSurbub(resp[0].surbub);
            setCity(resp[0].city);
            setCountry(resp[0].country);
            setPhoneno1(resp[0].phoneno1);
            setPhoneno2(resp[0].phoneno2);
            setEmail(resp[0].company_email);
            setStatus('Active');
            setPayment_style(resp[0].payment_style);
            setUsername(resp[0].username);
            await setUserEmail(resp[0].user_email);
            // setPassword(resp[0].password);
            await setPassword(otp);
            validate(user_email);
            setIsLoaded(true); // Variables have been loaded
        } catch (err) {
            console.log(err.message);
        }
    };

    const [isLoaded, setIsLoaded] = useState(false); // Flag to track if variables have been loaded

    useEffect(() => {
            if (isLoaded) {
                const userObj = {
                    account_type,
                    account_category,
                    signed_on,
                    name,
                    street,
                    surbub,
                    city,
                    country,
                    phoneno1,
                    phoneno2,
                    email,
                    payment_style,
                    status: 'Active',
                };
                console.log(userObj, phoneno1);

                AddClient(userObj, phoneno1); // Pass userObj to AddClient function
            }
        // } else {
        //     alert('This email is already in use!');
        // }
    }, [isLoaded]);

    const AddClient = async (userObj, phone) => {
        try {
            const res = await fetch(`${API_URL}/clients`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(userObj),
            });

            fetch(`${API_URL}/clients/clientid/${email}`).then(res => {
                return res.json()
            }).then(resp => {
                setClient_profile_id(resp.client_profile_id);
                console.log("get client ID")
                console.log(resp)
                AddUser(resp[0].client_profile_id, phone);
            }).catch((err) => {
                console.log(err.message);
            })
        } catch (err) {
            console.log(err.message);
        }
    };

    const AddUser = async (id, phone) => {
        console.log(phone);
        const userObj = {
            company_id,
            branch_id,
            username,
            password,
            role,
            user_email,
            category,
            notify,
            activesession,
            addproperty,
            editproperty,
            approverequests,
            delivery,
            status,
            id,
            phone,
            otp
        };
        console.log(userObj);
        try {
            const res = await fetch(`${API_URL}/users/client/`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(userObj),
            });
            toast.success("Saved successfully!");
            
            navigate("/Clients");
        } catch (err) {
            // ReverseStatus(regId);
            console.log(err.message);
        }
    };

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
                                <h1 class="mt-4">Pending Registrations</h1>
                                <ol class="breadcrumb mb-4">
                                    <li class="breadcrumb-item active"></li>
                                </ol>
                                <table className="table table-bordered">
                                    <thead className="bg-dark text-light">
                                        <tr>
                                            <td style={{ color: 'white' }}>ID</td>
                                            <td style={{ color: 'white' }}>Company Name</td>
                                            <td style={{ color: 'white' }}>Office no and Street</td>
                                            <td style={{ color: 'white' }}>Surbub</td>
                                            <td style={{ color: 'white' }}>City</td>
                                            <td style={{ color: 'white' }}>Country</td>
                                            <td style={{ color: 'white' }}>Phone No 1</td>
                                            <td style={{ color: 'white' }}>Phone No 2</td>
                                            <td style={{ color: 'white' }}>Company Email</td>
                                            <td style={{ color: 'white' }}>Payment style</td>
                                            <td style={{ color: 'white' }}>Username</td>
                                            <td style={{ color: 'white' }}>User Email</td>
                                            <td style={{ color: 'white' }}>national id image</td>
                                            <td style={{ color: 'white' }}>signed contract</td>
                                            <td style={{ color: 'white' }}>proof of payment</td>
                                            <td style={{ color: 'white' }}>Status</td>
                                            <td style={{ color: 'white' }}>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            userList.map((item) => (
                                                <tr key={item.registration_id}>
                                                    <td>{item.registration_id}</td>
                                                    <td>{item.company_name}</td>
                                                    <td>{item.house_number_and_street_name}</td>
                                                    <td>{item.surbub}</td>
                                                    <td>{item.city}</td>
                                                    <td>{item.country}</td>
                                                    <td>{item.phoneno1}</td>
                                                    <td>{item.phoneno2}</td>
                                                    <td>{item.company_email}</td>
                                                    <td>{item.payment_style}</td>
                                                    <td>{item.username}</td>
                                                    <td>{item.user_email}</td>
                                                    <td>
                                                        {item.nation_id_image && (
                                                            <a href={item.nation_id_image}>View Image</a>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item.signed_contract && (
                                                            <a href={item.signed_contract}>View file</a>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item.proof_of_payment && (
                                                            <a href={item.proof_of_payment}>View file</a>
                                                        )}
                                                    </td>
                                                    <td>{item.status}</td>
                                                    <td>
                                                        <a onClick={() => { validate(item.user_email, item.registration_id) }} style={{ color: "blue", cursor: "pointer" }}>Activate </a>_
                                                        {/* <a onClick={() => { UpdateStatus(item.registration_id) }} style={{ color: "blue", cursor: "pointer" }}>Activate </a>_ */}
                                                        <a onClick={() => { HandleRemove(item.registration_id) }} style={{ color: "blue" }} >Remove</a>
                                                    </td>
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

export default PendingReg;