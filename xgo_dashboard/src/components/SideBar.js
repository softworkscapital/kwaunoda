import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import axios from "axios";

const SideBar = () => {
  const [isAdmin, setIsAdmin] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const APILINK = API_URL;
  const [customersCount, setCustomersCount] = useState(0);
  const [tripsCount, setTripsCount] = useState(0);
  const [driversCount, setDriversCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [newTrips, setNewTrips] = useState(0);

  const getTrips = async () => {
    try {
      const response = await fetch(`${APILINK}/trip/`);
      const data = await response.json();
      console.log(data);
      setTripsCount(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getNewTrips = async () => {
    try {
      let status = "New Order";
      const response = await fetch(`${APILINK}/tripsbystatus/${status}`);
      const data = await response.json();
      console.log(data);
      setNewTrips(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getPending = async () => {
    let status = "Pending ";
    try {
      const response = await fetch(`${APILINK}/driver/driver_status/${status}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("All data:", data);
      setPendingCount(data.length);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };

  const getDrivers = async () => {
    try {
      const response = await fetch(`${APILINK}/driver/`);
      const data = await response.json();
      console.log(data);
      setDriversCount(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getCustomers = async () => {
    try {
      const response = await axios.get(`${APILINK}/customerdetails/`);
      const data = response.data;
      console.log(data);
      setCustomersCount(data.length);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    getDrivers();
    getCustomers();
    getTrips();
    getNewTrips();
    getPending();

    const interval = setInterval(() => {
      getDrivers();
      getCustomers();
      getTrips();
      getNewTrips();
      getPending();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Concept - Bootstrap 4 Admin Dashboard Template</title>
        <link
          rel="stylesheet"
          href="../assets/vendor/bootstrap/css/bootstrap.min.css"
        />
        <link
          href="../assets/vendor/fonts/circular-std/style.css"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="../assets/libs/css/style.css" />
        <link
          rel="stylesheet"
          href="../assets/vendor/fonts/fontawesome/css/fontawesome-all.css"
        />
      </head>
      <body>
        <div
          className="nav-left-sidebar sidebar-dark"
          style={{
            fontSize: "10px",
            backgroundColor: "#FFC000", // Changed background color
            textAlign: "left",
          }}
        >
          <div className="menu-list">
            <nav className="navbar navbar-expand-lg navbar-light">
              <div
                className={`collapse navbar-collapse${
                  isMenuOpen ? " show" : ""
                }`}
              >
                <ul className="navbar-nav flex-column">
                  <li className="">
                    <a
                      className="nav-link"
                      href="#"
                      style={{
                        fontSize: "24px",
                        color: "black",
                        alignSelf: "center",
                        fontWeight: "bold",
                      }}
                    >
                      MENU{" "}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/chatHome"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      CHAT<span className="badge badge-success">6</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/Customerstable/list"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      CUSTOMERS
                      <strong
                        style={{
                          fontSize: "15px",
                          marginLeft: "10px",
                        }}
                      >
                        {customersCount}
                      </strong>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/Driverstable/list"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      DRIVERS
                      <strong
                        style={{
                          fontSize: "15px",
                          marginLeft: "10px",
                        }}
                      >
                        {driversCount}
                      </strong>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      ALLOCATE TRIPS TO DRIVERS
                      <strong
                        style={{
                          fontSize: "15px",
                          marginLeft: "10px",
                        }}
                      >
                        {newTrips}
                      </strong>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/feedback"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      FEEDBACK
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/table/trips"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      TRIPS
                      <strong
                        style={{
                          fontSize: "15px",
                          marginLeft: "10px",
                        }}
                      >
                        {tripsCount}
                      </strong>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/Admindash"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      BILLING
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/search"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      SEARCH USER
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/verifyReg"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      PENDING VERIFICATION{" "}
                      <strong
                        style={{
                          fontSize: "15px",
                          marginLeft: "10px",
                        }}
                      >
                        {pendingCount}
                      </strong>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/billing"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      ACCOUNT TOP UP
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/searchTrip"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      SEARCH TRIP
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/broadcast"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      BROADCAST MESSAGE
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/analytics"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      ANALYTICS
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/reports"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      REPORTS
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/ReportAnalysis"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      REPORT ANALYSIS
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/pesepay"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      PESEPAY
                    </a>
                  </li>
                  {/* New Links */}
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/Configurations"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      CONFIGURATIONS
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/AppStatistics"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                      APPLICATION STATISTICS
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/DashTracker/1"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                       Trip Track
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="/Driversdisplay"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "black",
                        padding: "10px 20px",
                      }}
                    >
                       Home
                    </a>
                  </li>
                  <li
                    className="nav-item"
                    style={{ marginTop: "130px", color: "black" }}
                  >
                    <a style={{ color: "black" }} className="nav-link" href="#">
                      LOGOUT
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </body>
    </div>
  );
};

export default SideBar;