import React, { useState } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import MainContent from './MainContent'; // Ensure this is imported correctly
import BottomBar from './BottomBar'; // Import your BottomBar component
import { Col, Row, Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';

const Dashboard = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  return (
    <div className="dashboard">
       <Navbar/>
      <Container fluid>
        <Row>
          <Col md={9} className="order-2 order-md-1">
            <MainContent selectedTrip={selectedTrip} /> {/* Pass selectedTrip */}
            <Row>
              <Col>
                <div className="bottom-section">
                  <BottomBar onTripSelect={setSelectedTrip} /> {/* Ensure this is correct */}
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={3} className="order-1 order-md-2">
            <SideBar />
          </Col>
          <Footer/>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;