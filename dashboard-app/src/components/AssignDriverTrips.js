import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { Col, Row, Container } from "react-bootstrap";
import Navbar from "./Navbar";

const APILINK = API_URL;

const AssignDriverTrips = ({ customersData }) => {
  return (
    <div className="dashboard">
      <Navbar />
      <SideBar />
      <Footer />
    </div>
  );
};

export default AssignDriverTrips;
