import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/BottomBar.css'; // Custom CSS for additional styles
import { API_URL } from './config';

const BottomBar = ({ onTripSelect }) => {
  const APILINK = API_URL; // Replace with your API URL
  const [tripData, setTripData] = useState([]);

  const getData = async () => {
    try {
      let status = "InTransit"
      const response = await fetch(`${APILINK}/trip/tripsbystatus/${status}`);
      const data = await response.json();
      setTripData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bottom-bar">
      <Row className="m-0" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {tripData.map(trip => (
          <Col key={trip.trip_id} className="p-2" xs={12} style={{ display: 'block' }}>
            <Card
              className="trip-card"
              style={{ width: '100%' }}
              onClick={() => {
                console.log('Trip selected:', trip); // Debugging line
                onTripSelect(trip);
              }}
            >
              <Card.Body>
                <Card.Title>Trip ID: {trip.trip_id}</Card.Title>
                <Card.Text>
                  <strong>Status:</strong> {trip.status || 'N/A'}<br />
                  <strong>Customer Comment:</strong> {trip.customer_comment || 'None'}<br />
                  <strong>Driver Stars:</strong> {trip.driver_stars || 'N/A'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BottomBar;