import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import Navbar from "./Navbar";

const APILINK = API_URL;

const Reports = ({ customersData }) => {
  const [account_type, setAccount_type] = useState();
  const [account_category, setAccount_category] = useState();
  const [signed_on, setSigned_on] = useState();
  const [name, setName] = useState();
  const [hseNo, setHseNo] = useState();
  const [surbub, setSurbub] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [email, setEmail] = useState();
  const [membershipstatus, setMembershipStatus] = useState();
  const [topUpList, setTopUpList] = useState([]);
  const [isAdmin, setIsAdmin] = useState("");
  const [usage, setUsage] = useState("0");
  const APILINK = API_URL;

  useEffect(() => {
    fetchTopUp();

    const interval = setInterval(() => {
      fetchTopUp();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const role = "Admin";
    if (role === "Admin") {
      setIsAdmin(true);
    }
    if (role === "" || role === null) {
      window.location.href = "/";
    }

    const client_profile_id = localStorage.getItem("async_client_profile_id");
    fetch(`${API_URL}/topUp`)
      .then((res) => res.json())
      .then((resp) => {
        setTopUpList(resp.results);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    getBalance();
    getClientDetails();
  });

  const [balance, setBalance] = useState("0");
  const async_client_profile_id = localStorage.getItem(
    "async_client_profile_id"
  );

  const getBalance = () => {
    fetch(`${API_URL}/topUp/adminbal`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setBalance(resp.results[0].total_balance);
        setUsage(resp.results[0].total_usage);
        console.log(resp.results[0].total_balance);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getClientDetails = () => {
    fetch(`${API_URL}/clients/${async_client_profile_id}`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setName(resp[0].name);
        setAccount_type(resp[0].account_type);
        setAccount_category(resp[0].account_category);
        setSigned_on(resp[0].signed_on);
        setCountry(resp[0].country);
        setEmail(resp[0].email);
        setMembershipStatus(resp[0].membershipstatus);
        setHseNo(resp[0].house_number_and_street_name);
        setSurbub(resp[0].surbub);
        setCity(resp[0].city);
        console.log(resp[0].name);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const fetchTopUp = async () => {
    try {
      const response = await fetch(`${APILINK}/topUp/`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("All data:", data);

      if (Array.isArray(data.results)) {
        setTopUpList(data.results);
      } else {
        setTopUpList([]);
      }
    } catch (error) {
      console.error("Failed to fetch top-up data:", error);
      setTopUpList([]);
    }
  };

  useEffect(() => {
    fetchTopUp();
    const interval = setInterval(fetchTopUp, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />
      <Container fluid>
        <Row>
          <Col md={9} className="order-2 order-md-1">
            <div className="dashboard">
              <h1 style={{ marginTop: "20px" }}>.</h1>

              {/* Top Up Details Section */}
              <div style={{ marginTop: "30px" }}>
                <h1>REPORTS</h1>
                <div className="col-xl-12">
                  <div className="card">
                    <h2 className="card-header">
                      Reports
                      <Link
                        className="btn btn-primary btnAdd"
                        style={{ float: "right", marginRight: "40px" }}
                        to="/searchTrip"
                      >
                        Search Trip
                      </Link>
                    </h2>
                    <div className="card-body">
                      <div
                        className="table-responsive"
                        style={{
                          overflowY: "auto",
                          maxHeight: "400px",
                          maxWidth: "1000px",
                        }}
                      >
                        <table className="table table-striped table-bordered first">
                          <thead>
                            <tr>
                              <th>Top Up ID</th>
                              <th>Client ID</th>
                              <th>Date</th>
                              <th>Description</th>
                              <th>Debit</th>
                              <th>Credit</th>
                              <th>Total Balance</th>
                              <th>Currency</th>
                              <th>Exchange Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(topUpList) &&
                            topUpList.length > 0 ? (
                              topUpList.map((item) => (
                                <tr key={item.top_up_id}>
                                  <td>{item.top_up_id}</td>
                                  <td>{item.client_profile_id}</td>
                                  <td>
                                    {new Date(item.date).toLocaleDateString()}
                                  </td>
                                  <td>{item.description}</td>
                                  <td>${item.debit}</td>
                                  <td>${item.credit}</td>
                                  <td>${item.total_balance}</td>
                                  <td>{item.currency}</td>
                                  <td>{item.exchange_rate}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="9">No data available</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-3 col-md-6">
                      <div className="card bg-white text-black mb-4">
                        <h5>${balance + usage}</h5>
                        <h5>Total Balances</h5>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="card bg-white text-black mb-4">
                        <h5>${usage}</h5>
                        <h5>Billing Usage</h5>
                        <div className="small text-white">
                          <i className="fas fa-angle-right"></i>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                      <div className="card bg-white text-black mb-4">
                        <h5>${balance}</h5>
                        <h5>Billing Prepaid</h5>
                        <div className="small text-white">
                          <i className="fas fa-angle-right"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={3} className="order-1 order-md-1">
            <SideBar />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Reports;
