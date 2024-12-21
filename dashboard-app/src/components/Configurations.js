import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import Footer from "./Footer";
import { Col, Row, Container, Table, Button, Modal } from "react-bootstrap";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Configurations = () => {
    const [configData, setConfigData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConfigData();
    }, []);

    const fetchConfigData = async () => {
        try {
            const response = await fetch(`${API_URL}/application_configs`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched configuration data:", data);
            setConfigData(data);
            setErrorMessage(null);
        } catch (error) {
            console.error("Error fetching configuration data:", error);
            setErrorMessage("Failed to fetch configuration data. Please try again later.");
        }
    };

    const handleAddConfig = () => {
        navigate("/AddConfig");
    };

    const handleViewConfig = (config) => {
        setSelectedConfig(config); // Set the selected config
        setModalShow(true); // Show the modal
    };

    const handleCloseModal = () => {
        setModalShow(false); // Hide the modal
        setSelectedConfig(null); // Clear selected config
    };

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Row style={{ flex: 1 }}>
                <Col md={9}>
                    <h3 style={{ marginTop: "60px", marginBottom: "20px" }}>Configuration</h3>
                    <Button variant="primary" onClick={handleAddConfig} style={{ marginBottom: '20px' }}>
                        Add Configuration
                    </Button>
                    {errorMessage && <div style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</div>}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Application Config ID</th>
                                <th>Control Item</th>
                                <th>Value</th>
                                <th>User ID</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configData.length > 0 ? (
                                configData.map((config) => (
                                    <tr key={config.application_config_id}>
                                        <td>{config.application_config_id}</td>
                                        <td>{config.control_item}</td>
                                        <td>{config.value}</td>
                                        <td>{config.user_id}</td>
                                        <td>{new Date(config.date).toLocaleDateString()}</td>
                                        <td>
                                            <Button variant="info" onClick={() => handleViewConfig(config)}>
                                                View Config
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                        No configuration data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col>
                <Col md={3} style={{ position: 'relative', zIndex: 1 }}>
                    <SideBar />
                </Col>
            </Row>
            <Footer />

            {/* Modal for displaying configuration details */}
            <Modal show={modalShow} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Configuration Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedConfig ? (
                        <div>
                            <p><strong>Application Config ID:</strong> {selectedConfig.application_config_id}</p>
                            <p><strong>Control Item:</strong> {selectedConfig.control_item}</p>
                            <p><strong>Value:</strong> {selectedConfig.value}</p>
                            <p><strong>User ID:</strong> {selectedConfig.user_id}</p>
                            <p><strong>Date:</strong> {new Date(selectedConfig.date).toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Configurations;