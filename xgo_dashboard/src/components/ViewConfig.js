import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams, useNavigate } from "react-router-dom";

const ViewConfig = () => {
    const { id } = useParams(); // Get the config ID from the URL
    const [config, setConfig] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConfigData();
    }, [id]);

    const fetchConfigData = async () => {
        try {
            const response = await fetch(`${API_URL}/application_configs/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setConfig(data);
            setErrorMessage(null); // Clear any previous error message
        } catch (error) {
            console.error("Error fetching configuration data:", error);
            setErrorMessage("Failed to fetch configuration data. Please try again later.");
        }
    };

    const handleBack = () => {
        navigate("/configurations"); // Navigate back to configurations page
    };

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '60px' }}>
                <Col md={6}>
                    {errorMessage ? (
                        <div style={{ color: 'red' }}>{errorMessage}</div>
                    ) : config ? (
                        <Card style={{ padding: '20px' }}>
                            <Card.Body>
                                <Card.Title>Configuration Details</Card.Title>
                                <Card.Text>
                                    <strong>Application Config ID:</strong> {config.application_config_id}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Control Item:</strong> {config.control_item}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Value:</strong> {config.value}
                                </Card.Text>
                                <Card.Text>
                                    <strong>User ID:</strong> {config.user_id}
                                </Card.Text>
                                <Card.Text>
                                    <strong>Date:</strong> {new Date(config.date).toLocaleDateString()}
                                </Card.Text>
                                <Button variant="primary" onClick={handleBack}>
                                    Back to Configurations
                                </Button>
                            </Card.Body>
                        </Card>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};

export default ViewConfig;