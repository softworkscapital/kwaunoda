import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import Footer from "./Footer";
import { Container, Table, Row, Col } from "react-bootstrap";
import Navbar from "./Navbar";

const AppStatistics = () => {
    const [statistics, setStatistics] = useState([]);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await fetch(`${API_URL}/application_statistics`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched data:", data); // Log the fetched data
            setStatistics(data);
        } catch (error) {
            console.error("Error fetching statistics:", error.message);
        }
    };

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Row style={{ flex: 1 }}>
                {/* Main Content Area */}
                <Col md={9} style={{ padding: '15px', overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
                    <h3 style={{ margin: "60px 0 20px 0" }}>Application Statistics</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>KMs Billed</th>
                                    <th>Customers Count</th>
                                    <th>Drivers Count</th>
                                    <th>Trips Count</th>
                                    <th>Trips per Customer</th>
                                    <th>Billed Amount (USD)</th>
                                    <th>Average Trip Rate (USD)</th>
                                    <th>Mode Rate (USD)</th>
                                    <th>Average Billed</th>
                                    <th>New Customer Count</th>
                                    <th>New Drivers Count</th>
                                    <th>Complaints Count</th>
                                    <th>Total Rating Count</th>
                                    <th>Average Rating Count</th>
                                    <th>Driver Open Balance</th>
                                    <th>Driver Top Up</th>
                                    <th>Driver Billed Charges</th>
                                    <th>Driver Withdrawals</th>
                                    <th>Driver Escrow</th>
                                    <th>Driver Promo</th>
                                    <th>Driver Deductions</th>
                                    <th>Driver Additions</th>
                                    <th>Driver Close Balance</th>
                                    <th>Customer Open Balance</th>
                                    <th>Customer Top Up</th>
                                    <th>Customer Billed Charges</th>
                                    <th>Customer Withdrawals</th>
                                    <th>Customer Escrow</th>
                                    <th>Customer Promo</th>
                                    <th>Customer Deductions</th>
                                    <th>Customer Additions</th>
                                    <th>Customer Close Balance</th>
                                    <th>Company Open Balance</th>
                                    <th>Company Income from Charges</th>
                                    <th>Company Promotions</th>
                                    <th>Company Withdrawals Out</th>
                                    <th>Company Close Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.map((stat, index) => (
                                    <tr key={stat.application_statistic_id || index}>
                                        <td>{stat.datefor}</td>
                                        <td>{stat.kms_billed}</td>
                                        <td>{stat.customers_count}</td>
                                        <td>{stat.drivers_count}</td>
                                        <td>{stat.trips_count}</td>
                                        <td>{stat.trips_per_customer}</td>
                                        <td>{stat.billed_amount_usd}</td>
                                        <td>{stat.average_trip_rate_usd}</td>
                                        <td>{stat.mode_rate_usd}</td>
                                        <td>{stat.average_billed}</td>
                                        <td>{stat.new_customer_count}</td>
                                        <td>{stat.new_drivers_count}</td>
                                        <td>{stat.complaints_count || "N/A"}</td>
                                        <td>{stat.total_rating_count}</td>
                                        <td>{stat.ave_rating_count}</td>
                                        <td>{stat.driver_open_balance}</td>
                                        <td>{stat.driver_top_up}</td>
                                        <td>{stat.driver_billed_charges}</td>
                                        <td>{stat.driver_withdrawals}</td>
                                        <td>{stat.driver_escrow}</td>
                                        <td>{stat.driver_promo || "N/A"}</td>
                                        <td>{stat.driver_deductions}</td>
                                        <td>{stat.driver_additions}</td>
                                        <td>{stat.driver_close_balance}</td>
                                        <td>{stat.customer_open_balance}</td>
                                        <td>{stat.customer_top_up || "N/A"}</td>
                                        <td>{stat.customer_billed_charges}</td>
                                        <td>{stat.customer_withdrawals}</td>
                                        <td>{stat.customer_escrow}</td>
                                        <td>{stat.customer_promo || "N/A"}</td>
                                        <td>{stat.customer_deduction}</td>
                                        <td>{stat.customer_additions}</td>
                                        <td>{stat.customer_close_balance}</td>
                                        <td>{stat.company_open_balance}</td>
                                        <td>{stat.company_income_from_charges || "N/A"}</td>
                                        <td>{stat.company_promotions || "N/A"}</td>
                                        <td>{stat.company_withdraws_out}</td>
                                        <td>{stat.company_close_balance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Col>
                {/* Sidebar Area */}
                <Col md={3} style={{ paddingLeft: '15px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <SideBar />
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};

export default AppStatistics;