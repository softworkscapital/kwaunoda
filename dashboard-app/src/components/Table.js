import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { Col, Row, Container } from "react-bootstrap";
import Navbar from "./Navbar";

const Table = ({ tripData }) => {
  return (
    <div>
      <div className="dashboard">
        <Navbar />
        <Container fluid>
          <Row>
            <Col md={9} className="order-2 order-md-1">
              <div style={{ display: "flex" }}></div>
              <div
                style={{
                  width: "950px",
                  marginLeft: "30px",
                  marginTop: "70px",
                }}
              >
                <h1>Trip Details</h1>
                <div className="col-xl-12">
                  <div className="card">
                    <h2 className="card-header">
                      Trip Details Table
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
                              <th>trip_id</th>
                              <th>driver_id</th>
                              <th>request_start_datetime </th>
                              <th>order_start_datetime </th>
                              <th>order_end_datetime</th>
                              <th>status</th>
                              <th>delivery_details</th>
                              <th>delivery_notes</th>
                              <th>weight</th>
                              <th>delivery_contact_details</th>
                              <th>dest_location</th>
                              <th>origin_location</th>
                              <th>origin_location_lat</th>
                              <th>origin_location_long</th>
                              <th>destination_lat</th>
                              <th>destination_long</th>
                              <th>distance</th>
                              <th>delivery_cost_proposed</th>
                              <th>accepted_cost</th>
                              <th>paying_when</th>
                              <th>payment_type</th>
                              <th>currency_id</th>
                              <th>currency_code</th>
                              <th>usd_rate</th>
                              <th>customer_customer</th>
                              <th>driver_comment</th>
                              <th>driver_stars</th>
                              <th>customers_stars</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tripData.map((item) => (
                              <tr key={item.trip_id}>
                                <td>{item.trip_id}</td>
                                <td>{item.driver_id}</td>
                                <td>{item.cust_id}</td>
                                <td>
                                  {new Date(
                                    item.request_start_datetime
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  {new Date(
                                    item.order_start_datetime
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  {new Date(
                                    item.order_end_datetime
                                  ).toLocaleDateString()}
                                </td>
                                <td>{item.status}</td>
                                <td>{item.deliveray_details}</td>
                                <td>{item.delivery_notes}</td>
                                <td>{item.weight}</td>
                                <td>{item.delivery_contact_details}</td>
                                <td>{item.dest_location}</td>
                                <td>{item.origin_location}</td>
                                <td>{item.origin_location_lat}</td>
                                <td>{item.origin_location_long}</td>
                                <td>{item.destination_lat}</td>
                                <td>{item.destination_long}</td>
                                <td>{item.distance}</td>
                                <td>{item.delivery_cost_proposed}</td>
                                <td>{item.accepted_cost}</td>
                                <td>{item.paying_when}</td>
                                <td>{item.payment_type}</td>
                                <td>{item.currency_id}</td>
                                <td>{item.currency_code}</td>
                                <td>{item.usd_rate}</td>
                                <td>{item.customer_comment}</td>
                                <td>{item.driver_comment}</td>
                                <td>{item.driver_stars}</td>
                                <td>{item.customer_stars}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scripts should not be included in React components */}
              {/* 
          <script src="../assets/vendor/jquery/jquery-3.3.1.min.js"></script>
          <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.js"></script>
          <script src="../assets/vendor/slimscroll/jquery.slimscroll.js"></script>
          <script src="../assets/libs/js/main-js.js"></script> 
          */}
            </Col>
            <Col md={3} className="order-1 order-md-2">
              <SideBar />
            </Col>
            <Footer />
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Table;
