import React from "react";
import { Container } from "react-bootstrap";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AddConfig = () => {
    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '20px' }}>
                <h3>Add Configuration</h3>
                {/* Form for adding configuration will go here */}
                <form>
                    <div>
                        <label htmlFor="controlItem">Control Item:</label>
                        <input type="text" id="controlItem" required />
                    </div>
                    <div>
                        <label htmlFor="value">Value:</label>
                        <input type="text" id="value" required />
                    </div>
                    <button type="submit">Add</button>
                </form>
            </div>
            <Footer />
        </Container>
    );
};

export default AddConfig;