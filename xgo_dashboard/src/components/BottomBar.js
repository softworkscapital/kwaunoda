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
      console.log("data",data);
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
              <div>
                <div className="row" style={{ fontSize:10}}>
              <div className="col-md-12"style={{ fontSize:10,fontWeight:'bold', alignContent:'left' }}>Trip ID: {trip.trip_id}</div>
              <div className="col-md-12"><br></br></div>
              <div className="col-md-12">{trip.deliveray_details || 'N/A'}</div>
              <div className="col-md-12"><br></br></div>
              <div className="col-md-12"><strong> {"From : "}{trip.origin_location || 'N/A'}</strong></div>
              <div className="col-md-12"><strong> {"To   : "}{trip.dest_location || 'N/A'}</strong></div>
              <div className="col-md-12"><br></br></div>
              <div className="col-md-3">Driver ID <strong>{trip.driver_id || 'N/A'}</strong></div>
              <div className="col-md-3">Customer ID <strong>{trip.cust_id || 'N/A'}</strong></div>
              <div className="col-md-12"><br></br></div>
              
              <div className="col-md-3">Status:<strong> {trip.status || 'N/A'}</strong></div>
              <div className="col-md-3">Accepted Cost</div>
              <div className="col-md-3"><strong> {trip.accepted_cost}{trip.currency}</strong></div>


              

    
              
              

              </div>
              </div>
              
              <Card.Body>
                <Card.Title></Card.Title>
                <Card.Text>
                  
            
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