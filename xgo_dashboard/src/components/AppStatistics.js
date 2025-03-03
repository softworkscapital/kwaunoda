import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import Footer from "./Footer";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import Navbar from "./Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AppStatistics = () => {
    const [statistics, setStatistics] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    useEffect(() => {
        fetchStatistics();
    }, [selectedDate]);

    const fetchStatistics = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
            const response = await fetch(`${API_URL}/application_statistics?date=${formattedDate}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched data:", data); // Log the fetched data

            if (data.length === 0) {
                setShowModal(true); // Show modal if no data
            } else {
                setStatistics(data);
                setCurrentIndex(0); // Reset index when fetching new data
            }
        } catch (error) {
            console.error("Error fetching statistics:", error.message);
        }
    };

    const handleNext = () => {
        if (currentIndex < statistics.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentStat = statistics[currentIndex];

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Row style={{ flex: 1 }}>
                {/* Main Content Area */}
                <Col md={9} style={{ padding: '15px', overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
                    <h3 style={{ margin: "60px 0 20px 0" }}>Application Statistics</h3>
                    
                    {/* Date Picker */}
                    <div className="mb-4">
                        <DatePicker
                            selected={selectedDate}
                            onChange={date => setSelectedDate(date)}
                            dateFormat="yyyy/MM/dd"
                            className="form-control"
                        />
                    </div>

                    {currentStat ? (
                        <Card style={{ marginBottom: '20px' }}>
                            <Card.Body>
                                <Card.Title>{`Statistics for ${currentStat.datefor}`}</Card.Title>
                                
                                {/* General Information Section */}
                                <h5 style={{ color: '#007bff', fontWeight: 'bold' }}>General Information</h5>
                                <Row>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Date:</strong></Col>
                                            <Col>{currentStat.datefor}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>KMs Billed:</strong></Col>
                                            <Col>{currentStat.kms_billed}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Customers Count:</strong></Col>
                                            <Col>{currentStat.customers_count}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Drivers Count:</strong></Col>
                                            <Col>{currentStat.drivers_count}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Trips Count:</strong></Col>
                                            <Col>{currentStat.trips_count}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Trips per Customer:</strong></Col>
                                            <Col>{currentStat.trips_per_customer}</Col>
                                        </Row>
                                    </Col>
                                </Row>

                                {/* Financials Section */}
                                <h5 style={{ color: '#007bff', fontWeight: 'bold' }}>Financials</h5>
                                <Row>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Billed Amount (USD):</strong></Col>
                                            <Col>{currentStat.billed_amount_usd}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Average Trip Rate (USD):</strong></Col>
                                            <Col>{currentStat.average_trip_rate_usd}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Mode Rate (USD):</strong></Col>
                                            <Col>{currentStat.mode_rate_usd}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Average Billed:</strong></Col>
                                            <Col>{currentStat.average_billed}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Driver Open Balance:</strong></Col>
                                            <Col>{currentStat.driver_open_balance}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Customer Open Balance:</strong></Col>
                                            <Col>{currentStat.customer_open_balance}</Col>
                                        </Row>
                                    </Col>
                                </Row>

                                {/* Driver/Customer Statistics Section */}
                                <h5 style={{ color: '#007bff', fontWeight: 'bold' }}>Driver/Customer Statistics</h5>
                                <Row>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>New Customer Count:</strong></Col>
                                            <Col>{currentStat.new_customer_count}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>New Drivers Count:</strong></Col>
                                            <Col>{currentStat.new_drivers_count}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Complaints Count:</strong></Col>
                                            <Col>{currentStat.complaints_count || "N/A"}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Total Rating Count:</strong></Col>
                                            <Col>{currentStat.total_rating_count}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Average Rating Count:</strong></Col>
                                            <Col>{currentStat.ave_rating_count}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Driver Top Up:</strong></Col>
                                            <Col>{currentStat.driver_top_up}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Driver Billed Charges:</strong></Col>
                                            <Col>{currentStat.driver_billed_charges}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Driver Withdrawals:</strong></Col>
                                            <Col>{currentStat.driver_withdrawals}</Col>
                                        </Row>
                                    </Col>
                                </Row>

                                {/* Driver Escrow and Promotions Section */}
                                <h5 style={{ color: '#007bff', fontWeight: 'bold' }}>Driver Escrow and Promotions</h5>
                                <Row>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Driver Escrow:</strong></Col>
                                            <Col>{currentStat.driver_escrow}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Driver Promo:</strong></Col>
                                            <Col>{currentStat.driver_promo || "N/A"}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Driver Deductions:</strong></Col>
                                            <Col>{currentStat.driver_deductions}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Driver Additions:</strong></Col>
                                            <Col>{currentStat.driver_additions}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Driver Close Balance:</strong></Col>
                                            <Col>{currentStat.driver_close_balance}</Col>
                                        </Row>
                                    </Col>
                                </Row>

                                {/* Customer Statistics Section */}
                                <h5 style={{ color: '#007bff', fontWeight: 'bold' }}>Customer Statistics</h5>
                                <Row>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Customer Top Up:</strong></Col>
                                            <Col>{currentStat.customer_top_up || "N/A"}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Customer Billed Charges:</strong></Col>
                                            <Col>{currentStat.customer_billed_charges}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Customer Withdrawals:</strong></Col>
                                            <Col>{currentStat.customer_withdrawals}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Customer Escrow:</strong></Col>
                                            <Col>{currentStat.customer_escrow}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Customer Promo:</strong></Col>
                                            <Col>{currentStat.customer_promo || "N/A"}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Customer Deductions:</strong></Col>
                                            <Col>{currentStat.customer_deduction}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Customer Additions:</strong></Col>
                                            <Col>{currentStat.customer_additions}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Customer Close Balance:</strong></Col>
                                            <Col>{currentStat.customer_close_balance}</Col>
                                        </Row>
                                    </Col>
                                </Row>

                                {/* Company Statistics Section */}
                                <h5 style={{ color: '#007bff', fontWeight: 'bold' }}>Company Statistics</h5>
                                <Row>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Company Open Balance:</strong></Col>
                                            <Col>{currentStat.company_open_balance}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Company Income from Charges:</strong></Col>
                                            <Col>{currentStat.company_income_from_charges || "N/A"}</Col>
                                        </Row>
                                    </Col>
                                    <Col md={6}>
                                        <Row>
                                            <Col><strong>Company Promotions:</strong></Col>
                                            <Col>{currentStat.company_promotions || "N/A"}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Company Withdraws Out:</strong></Col>
                                            <Col>{currentStat.company_withdraws_out}</Col>
                                        </Row>
                                        <Row>
                                            <Col><strong>Company Close Balance:</strong></Col>
                                            <Col>{currentStat.company_close_balance}</Col>
                                        </Row>
                                    </Col>
                                </Row>

                                {/* Add more sections as needed */}
                            </Card.Body>
                        </Card>
                    ) : (
                        <Card>
                            <Card.Body>
                                <h5>No statistics available</h5>
                            </Card.Body>
                        </Card>
                    )}
                    <div className="d-flex justify-content-between">
                        <Button onClick={handlePrev} disabled={currentIndex === 0}>Previous</Button>
                        <Button onClick={handleNext} disabled={currentIndex === statistics.length - 1}>Next</Button>
                    </div>
                </Col>
                {/* Sidebar Area */}
                <Col md={3} style={{ paddingLeft: '15px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <SideBar />
                </Col>
            </Row>

            {/* Modal for No Data */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>No Data Available</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>No statistics are available for the selected date. Please choose another date.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </Container>
    );
};

export default AppStatistics;