import React, { useEffect, useState } from "react";
import { API_URL } from "./config";
import { Container, Table } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ViewConfig = () => {
    const [configData, setConfigData] = useState([]);

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

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '20px' }}>
                <h3>View Configurations</h3>
                <Table striped bordered hover>
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
            </div>
            <Footer />
        </Container>
    );
};

export default ViewConfig;