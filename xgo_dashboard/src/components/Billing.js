import React, { useState } from "react";
import { useEffect } from "react";
// import { useNavigation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
// import Header from "./from tellthem/Header";
// import AdminHeader from "./from tellthem/AdminHeader"
import { API_URL } from "./config";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Billing = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [topUpList, setTopUpList] = useState([]);
  const [isAdmin, setIsAdmin] = useState("");

  useEffect(() => {
    const role = "Admin";
    if (role === "Admin") {
      setIsAdmin(true);
    }
    if (role === "" || role === null) {
      window.location.href = "/";
    }
    const client_profile_id = localStorage.getItem("async_client_profile_id");
    fetch(`${API_URL}/topUp/`)
      .then((res) => res.json())
      .then((resp) => {
        setTopUpList(resp.results);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>
      <body className="sb-nav-fixed">
        <div id="layoutSidenav">
          <div id="layoutSidenav_content">
            <main>
              <div className="container-fluid px-4">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#FFD700", // Golden color for the icon
                      fontSize: "24px",
                      marginRight: "10px", // Space between button and title
                    }}
                    onClick={() => navigate(-1)} // Navigate back to the previous page
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                  </button>
                </div>
                <h1 className="mt-4">Account Top Up</h1>
                <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item active"></li>
                </ol>
                <div>
                  <button
                    className="btn btn-success btnAdd"
                    style={{ float: "right" }}
                    onClick={() => navigate("/AddTopUp")}
                  >
                    Account Top Up
                  </button>
                </div>
                <table className="table table-bordered">
                  <thead className="bg-dark text-light">
                    <tr>
                      <td style={{ color: "white" }}>Date</td>
                      <td style={{ color: "white" }}>Details</td>
                      <td style={{ color: "white" }}>Dr</td>
                      <td style={{ color: "white" }}>Cr</td>
                      <td style={{ color: "white" }}>Balance</td>
                      <td style={{ color: "white" }}>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {topUpList.map((item) => (
                      <tr key={item.top_up_id}>
                        <td>{item.date}</td>
                        <td>{item.description}</td>
                        <td>{item.debit}</td>
                        <td>{item.credit}</td>
                        <td>{item.balance}</td>
                        <td>
                          <a href={`/EditUser/${item.top_up_id}`}>Edit</a>
                          <a href="/item">Remove</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </body>
    </div>
  );
};

export default Billing;
