import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import Footer from "./Footer";
import { Col, Row, Container, Table, Button } from "react-bootstrap";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Configurations = () => {
    const [configData, setConfigData] = useState([]);
    const navigate = useNavigate(); // Initialize navigate for navigation

    useEffect(() => {
        fetchConfigData();
    }, []);

    const fetchConfigData = async () => {
        try {
            const response = await fetch(`${API_URL}/config`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setConfigData(data);
        } catch (error) {
            console.error("Error fetching configuration data:", error);
        }
    };

    const handleAddConfig = () => {
        navigate("/add-config"); // Navigate to AddConfig
    };

    const handleViewConfig = () => {
        navigate("/view-config"); // Navigate to ViewConfig
    };

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Row style={{ flex: 1 }}>
                <Col md={9}>
                    <h3 style={{ marginTop: "60px", marginBottom: "20px" }}>Configuration</h3>
                    <Button variant="primary" onClick={handleAddConfig} style={{ marginRight: '10px' }}>
                        Add Configuration
                    </Button>
                    <Button variant="secondary" onClick={handleViewConfig}>
                        View Configurations
                    </Button>
                    <Table striped bordered hover style={{ marginTop: "20px" }}>
                        <thead>
                            <tr>
                                <th>Control Item</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configData.map((config, index) => (
                                <tr key={index}>
                                    <td>{config.control_item}</td>
                                    <td>{config.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col md={3} style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'fixed', right: 0, top: '60px', bottom: '60px', overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
                        <SideBar />
                    </div>
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};

export default Configurations;