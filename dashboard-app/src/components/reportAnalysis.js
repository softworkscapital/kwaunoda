import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import { Col, Row, Container, Dropdown } from "react-bootstrap";
import Navbar from "./Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Reports = ({ customersData }) => {
  const [topUpList, setTopUpList] = useState([]);
  const [filteredTopUpList, setFilteredTopUpList] = useState([]);
  const [startDate, setStartDate] = useState(null); // Initially null
  const [endDate, setEndDate] = useState(new Date());
  const APILINK = API_URL;
  const navigate = useNavigate();
  const [activeWallet, setActiveWallet] = useState("main_wallet");
  const [balances, setBalances] = useState({});

  const walletOptions = [
    { name: "Select View", value: "main_wallet" },
    { name: "Escrow", value: "escrow" },
    { name: "Main Wallet", value: "main_wallet" },
    { name: "Payment Gateway", value: "payment_gateway" },
    { name: "Revenue Wallet", value: "revenue_wallet" },
    { name: "User Wallet", value: "user_wallet" },
    { name: "Vendor Wallet", value: "vendor_wallet" },
  ];

  useEffect(() => {
    fetchTopUp();
    const interval = setInterval(() => {
      fetchTopUp();
      getBalanceForCards();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterTopUpsByDate();
  }, [startDate, endDate, topUpList]);

  const fetchTopUp = async () => {
    try {
      const response = await fetch(`${APILINK}/topUp/`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.results)) {
        setTopUpList(data.results);
        setFilteredTopUpList(data.results); // Set filtered list initially to all data

        // Find the oldest date in the response and set it as the start date only if not set by user
        const dates = data.results.map((item) => new Date(item.date));
        const oldestDate = new Date(Math.min(...dates));

        // Set startDate only if it's still null
        if (!startDate) {
          setStartDate(oldestDate);
        }
        setEndDate(new Date()); // Set the end date to today or the latest date
      }
    } catch (error) {
      console.error("Failed to fetch top-up data:", error);
      setTopUpList([]);
      setFilteredTopUpList([]);
    }
  };

  const filterTopUpsByDate = () => {
    const filtered = topUpList.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
    setFilteredTopUpList(filtered);
  };

  const getBalanceForCards = () => {
    fetch(`${API_URL}/topUp/get_all_entity_total_balances`)
      .then((res) => res.json())
      .then((resp) => {
        setBalances(resp[0] || {}); // Ensure it's an object
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <Navbar />
      <Container fluid>
        <Row>
          <Col md={12} className="order-2 order-md-1">
            <div className="dashboard">
              <h1 style={{ marginTop: "15px" }}>.</h1>

              <div>
                <div className="col-xl-12">
                  <div className="card">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
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
                    <h2 className="card-header">
                      Reports
                      <div className="d-flex overflow-x-auto">
                        {/* Balance Cards */}
                        <div
                          className="card bg-white text-black mb-4"
                          style={{ minWidth: "200px", marginRight: "10px" }}
                        >
                          <h2 style={{ color: "black" }}>
                            ${balances.escrow_total_balance || 0}
                          </h2>
                          <h5>Escrow</h5>
                        </div>
                        <div
                          className="card bg-white text-black mb-4"
                          style={{ minWidth: "200px", marginRight: "10px" }}
                        >
                          <h2 style={{ color: "black" }}>
                            ${balances.vendor_wallet_total_balance || 0}
                          </h2>
                          <h5>Vendor Wallet</h5>
                        </div>
                        <div
                          className="card bg-white text-black mb-4"
                          style={{ minWidth: "200px", marginRight: "10px" }}
                        >
                          <h2 style={{ color: "black" }}>
                            ${balances.main_wallet_total_balance || 0}
                          </h2>
                          <h5>Main Wallet</h5>
                        </div>
                        <div
                          className="card bg-white text-black mb-4"
                          style={{ minWidth: "200px", marginRight: "10px" }}
                        >
                          <h2 style={{ color: "black" }}>
                            ${balances.user_wallet_total_balance || 0}
                          </h2>
                          <h5>User Wallet</h5>
                        </div>
                        <div
                          className="card bg-white text-black mb-4"
                          style={{ minWidth: "200px", marginRight: "10px" }}
                        >
                          <h2 style={{ color: "black" }}>
                            $
                            {balances.payment_gateway_charges_total_balance ||
                              0}
                          </h2>
                          <h5>Payment Gateway Charges</h5>
                        </div>
                        <div
                          className="card bg-white text-black mb-4"
                          style={{ minWidth: "200px", marginRight: "10px" }}
                        >
                          <h2 style={{ color: "black" }}>
                            ${balances.revenue_wallet_total_balance || 0}
                          </h2>
                          <h5>Revenue Wallet</h5>
                        </div>
                      </div>
                    </h2>
                    <div className="d-flex justify-content-end align-items-center">
                      {/* Date Pickers */}
                      <h3 style={{ fontSize: 35, padding: 10 }}>From:</h3>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          filterTopUpsByDate(); // Filter on date change
                        }}
                        className="me-2 form-control"
                        placeholderText="Start Date"
                        style={{ height: "40px", fontSize: 16 }} // Set height and font size
                      />

                      <h3
                        style={{
                          fontSize: 35,
                          paddingLeft: 12,
                          paddingRight: 8,
                          paddingTop: 10,
                        }}
                      >
                        To:
                      </h3>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                          setEndDate(date);
                          filterTopUpsByDate(); // Filter on date change
                        }}
                        className="me-2 form-control"
                        placeholderText="End Date"
                        style={{ height: "40px", fontSize: 16 }} // Set height and font size
                      />

                      <Dropdown
                        className="me-2"
                        style={{ height: "38px", marginBottom: 18 }}
                      >
                        <Dropdown.Toggle
                          variant="light"
                          id="wallet-dropdown"
                          style={{
                            backgroundColor: "transparent",
                            borderWidth: 1,
                            borderColor: "black",
                            height: "100%",
                          }}
                        >
                          {walletOptions.find(
                            (option) => option.value === activeWallet
                          )?.name || "Select View"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {walletOptions.map((option) => (
                            <Dropdown.Item
                              key={option.value}
                              onClick={() => setActiveWallet(option.value)}
                            >
                              {option.name}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>

                      {/* <button
                        className="btn btn-primary"
                        onClick={() => {}}
                        style={{ height: "40px", marginBottom: 12 }} // Set height
                      >
                        Go
                      </button> */}
                    </div>

                    <div className="card-body">
                      <div
                        className="table-responsive"
                        style={{ overflowY: "auto", maxHeight: "400px" }}
                      >
                        <table className="table table-striped table-bordered first">
                          <thead>
                            <tr>
                              <th>Top Up ID</th>
                              <th>Client ID</th>
                              <th>Date</th>
                              <th>Description</th>
                              {activeWallet === "escrow" && (
                                <>
                                  <th>Escrow Debit</th>
                                  <th>Escrow Credit</th>
                                  <th>Escrow Total Balance</th>
                                </>
                              )}
                              {activeWallet === "main_wallet" && (
                                <>
                                  <th>Main Wallet Debit</th>
                                  <th>Main Wallet Credit</th>
                                  <th>Main Wallet Total Balance</th>
                                </>
                              )}
                              {activeWallet === "payment_gateway" && (
                                <>
                                  <th>Payment Gateway Debit</th>
                                  <th>Payment Gateway Credit</th>
                                  <th>Payment Gateway Total Balance</th>
                                </>
                              )}
                              {activeWallet === "revenue_wallet" && (
                                <>
                                  <th>Revenue Wallet Debit</th>
                                  <th>Revenue Wallet Credit</th>
                                  <th>Revenue Wallet Total Balance</th>
                                </>
                              )}
                              {activeWallet === "user_wallet" && (
                                <>
                                  <th>User Wallet Debit</th>
                                  <th>User Wallet Credit</th>
                                  <th>User Wallet Total Balance</th>
                                </>
                              )}
                              {activeWallet === "vendor_wallet" && (
                                <>
                                  <th>Vendor Wallet Debit</th>
                                  <th>Vendor Wallet Credit</th>
                                  <th>Vendor Wallet Total Balance</th>
                                </>
                              )}
                              <th>Currency</th>
                              <th>Exchange Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(filteredTopUpList) &&
                            filteredTopUpList.length > 0 ? (
                              filteredTopUpList.map((item) => (
                                <tr key={item.top_up_id}>
                                  <td>{item.top_up_id}</td>
                                  <td>{item.client_profile_id}</td>
                                  <td>
                                    {new Date(item.date).toLocaleDateString()}
                                  </td>
                                  <td>{item.description}</td>
                                  {activeWallet === "escrow" && (
                                    <>
                                      <td>${item.escrow_debit || 0}</td>
                                      <td>${item.escrow_credit || 0}</td>
                                      <td>${item.escrow_total_balance || 0}</td>
                                    </>
                                  )}
                                  {activeWallet === "main_wallet" && (
                                    <>
                                      <td>${item.main_wallet_debit || 0}</td>
                                      <td>${item.main_wallet_credit || 0}</td>
                                      <td>
                                        ${item.main_wallet_total_balance || 0}
                                      </td>
                                    </>
                                  )}
                                  {activeWallet === "payment_gateway" && (
                                    <>
                                      <td>
                                        $
                                        {item.payment_gateway_charges_debit ||
                                          0}
                                      </td>
                                      <td>
                                        $
                                        {item.payment_gateway_charges_credit ||
                                          0}
                                      </td>
                                      <td>
                                        $
                                        {item.payment_gateway_charges_total_balance ||
                                          0}
                                      </td>
                                    </>
                                  )}
                                  {activeWallet === "revenue_wallet" && (
                                    <>
                                      <td>${item.revenue_wallet_debit || 0}</td>
                                      <td>
                                        ${item.revenue_wallet_credit || 0}
                                      </td>
                                      <td>
                                        $
                                        {item.revenue_wallet_total_balance || 0}
                                      </td>
                                    </>
                                  )}
                                  {activeWallet === "user_wallet" && (
                                    <>
                                      <td>${item.user_wallet_debit || 0}</td>
                                      <td>${item.user_wallet_credit || 0}</td>
                                      <td>
                                        ${item.user_wallet_total_balance || 0}
                                      </td>
                                    </>
                                  )}
                                  {activeWallet === "vendor_wallet" && (
                                    <>
                                      <td>${item.vendor_wallet_debit || 0}</td>
                                      <td>${item.vendor_wallet_credit || 0}</td>
                                      <td>
                                        ${item.vendor_wallet_total_balance || 0}
                                      </td>
                                    </>
                                  )}
                                  <td>{item.currency}</td>
                                  <td>{item.exchange_rate}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="22">No data available</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reports;
