import React from "react";
import { API_URL } from "./config";
import { Col, Row, Container, Card } from "react-bootstrap";
import './Analytics.css'; // Import custom CSS for additional styling

const APILINK = API_URL;

const Analytics = ({ customersData }) => {
  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Card className="analytics-card">
            <Card.Body>
              <Card.Title className="text-center">
                <h1 className="my-4">Analytics Overview</h1>
              </Card.Title>
              <Card.Text>
                <div className="analytics-item">
                  <strong>Ave Trip:</strong>
                  <span className="value">27</span>
                </div>
                <div className="analytics-item">
                  <strong>Ave Trip Completed:</strong>
                  <span className="value">27</span>
                </div>
                <div className="analytics-item">
                  <strong>Ave Trip Value:</strong>
                  <span className="value">$6.00</span>
                </div>
                <div className="analytics-item">
                  <strong>Driver Ave Trips Daily:</strong>
                  <span className="value">14</span>
                </div>
                <div className="analytics-item">
                  <strong>Driver Ave Trips Weekly:</strong>
                  <span className="value">69</span>
                </div>
                <div className="analytics-item">
                  <strong>Ave Driver Stars:</strong>
                  <span className="value">4</span>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;