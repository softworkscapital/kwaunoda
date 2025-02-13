import React, { useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SideBar from "./SideBar"; // Import the SideBar component
import { API_URL } from "./config";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddConfig = () => {
    const [controlItem, setControlItem] = useState("");
    const [value, setValue] = useState("");
    const navigate = useNavigate(); // Initialize navigate

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const postData = {
            control_item: controlItem, // Updated key
            value,
        };

        // Log the object being sent
        console.log('Data being sent:', postData);

        try {
            const response = await fetch(`${API_URL}/application_configs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle successful response
            const data = await response.json();
            console.log('Success:', data);

            // Show success message using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Configuration Added',
                text: 'Your configuration has been successfully added!',
            }).then(() => {
                // Redirect to Configurations page after closing the alert
                navigate("/Configurations");
            });

            // Optionally reset form fields
            setControlItem("");
            setValue("");
        } catch (error) {
            // Handle error and show error message using SweetAlert
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'There was an error adding the configuration. Please try again.',
            });
        }
    };

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Row style={{ flex: 1 }}>
                <Col md={9} className="d-flex justify-content-center align-items-center">
                    <Card style={{ width: '100%', maxWidth: '800px', padding: '40px', marginTop: '60px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <h3>Add Configuration</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formControlItem">
                                <Form.Label>Control Item</Form.Label>
                                <Form.Select 
                                    required 
                                    value={controlItem}
                                    onChange={(e) => setControlItem(e.target.value)} 
                                >
                                    <option value="">Select a control item</option>
                                    <option value="In Trip Location Sync Interval">In Trip Location Sync Interval</option>
                                    <option value="New Trip Location Sync Interval">New Trip Location Sync Interval</option>
                                    <option value="New Driver Free Interval">New Driver Free Interval</option>
                                    <option value="Last Support Date Previous Version">Last Support Date Previous Version</option>
                                    <option value="APK Version Name">APK Version Name</option>
                                    <option value="Latest Update Available Feature 1">Latest Update Available Feature 1</option>
                                    <option value="Latest Update Available Feature 2">Latest Update Available Feature 2</option>
                                    <option value="Latest Update Available Feature 3">Latest Update Available Feature 3</option>
                                    <option value="Latest APK Download Link (URL)">Latest APK Download Link (URL)</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formValue">
                                <Form.Label>Value</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter value" 
                                    required 
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)} 
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                                Submit
                            </Button>
                        </Form>
                    </Card>
                </Col>
                <Col md={3} style={{ position: 'relative', zIndex: 1 }}>
                    <SideBar />
                </Col>
            </Row>
            <Footer />
        </Container>
    );
};

export default AddConfig;