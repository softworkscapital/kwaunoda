import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import { Col, Row, Container } from "react-bootstrap";
import Navbar from "./Navbar";

const ReportAnalysis = ({ customersData }) => {
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
  const [balanceData, setBalanceData] = useState({});
  const APILINK = API_URL;

  // Fetch top-up data and balance
  useEffect(() => {
    fetchTopUp();
    getBalance();
    getClientDetails();
    const interval = setInterval(() => {
      fetchTopUp();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTopUp = async () => {
    try {
      const response = await fetch(`${APILINK}/topUp/`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setTopUpList(data.results || []);
    } catch (error) {
      console.error("Failed to fetch top-up data:", error);
      setTopUpList([]);
    }
  };

  const getBalance = () => {
    fetch(`${API_URL}/topUp/adminbal`)
      .then((res) => res.json())
      .then((resp) => {
        setBalanceData(resp.results[0] || {});
        setUsage(resp.results[0]?.total_usage || "0");
      })
      .catch((err) => console.log(err.message));
  };

  const getClientDetails = () => {
    const async_client_profile_id = localStorage.getItem("async_client_profile_id");
    fetch(`${API_URL}/clients/${async_client_profile_id}`)
      .then((res) => res.json())
      .then((resp) => {
        const client = resp[0] || {};
        setName(client.name);
        setAccount_type(client.account_type);
        setAccount_category(client.account_category);
        setSigned_on(client.signed_on);
        setCountry(client.country);
        setEmail(client.email);
        setMembershipStatus(client.membershipstatus);
        setHseNo(client.house_number_and_street_name);
        setSurbub(client.surbub);
        setCity(client.city);
      })
      .catch((err) => console.log(err.message));
  };

  // Mapping the total balance keys
  const totalBalanceKeys = [
    'escrow_total_balance',
    'main_wallet_total_balance',
    'payment_gateway_charges_total_balance',
    'revenue_wallet_total_balance',
    'user_wallet_total_balance',
    'vendor_wallet_total_balance',
  ];

  return (
    <div>
      <Navbar />
      <Container fluid>
        <Row>
          <Col md={9} className="order-2 order-md-1">
            <div className="dashboard">
              <h1 style={{ marginTop: "20px" }}>.</h1>
              <div style={{ marginTop: "30px" }}>
                <h1>REPORTS</h1>
                <div className="col-xl-12">
                  <div className="card">
                    <h2 className="card-header">Reports</h2>
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="d-flex overflow-x-auto">
                          {totalBalanceKeys.map((key) => (
                            <div className="card bg-white text-black mb-4" style={{ minWidth: "200px", marginRight: "10px" }} key={key}>
                              <h5>${balanceData[key] !== null ? balanceData[key] : 0}</h5>
                              <h5>{key.replace('_total_balance', '').replace(/_/g, ' ')} Total Balance</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Rest of your existing code here */}
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

export default ReportAnalysis;