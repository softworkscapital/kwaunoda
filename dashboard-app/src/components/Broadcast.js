import React, { useState, useEffect } from "react";
import { API_URL } from "./config";
import SideBar from "./SideBar";
import Footer from "./Footer";
import { Col, Row, Container, Button, Form } from "react-bootstrap";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const APILINK = API_URL;

const Broadcast = ({ customersData }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [driversData, setDriversData] = useState([]);

  const getDrivers = async () => {
    try {
      const response = await fetch(`${APILINK}/driver/`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      // Extract the phone numbers into an array
      const phoneNumbers = data.map((driver) => driver.phone);
      console.log("Phone Numbers:", phoneNumbers);

      // Store the array of phone numbers in state
      setDriversData(phoneNumbers);
    } catch (error) {
      console.log("Failed to fetch drivers:", error);
    }
  };

  const sendSmsBroadcast = async () => {
    if (driversData.length === 0) {
      toast.error("No phone numbers available to send SMS.");
      return;
    }

    const phoneNumbers = driversData.join(", "); // Create a comma-separated string

    try {
      const response = await fetch(
        "https://srv547457.hstgr.cloud:3003/smsendpoint",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientid: "1001",
            clientkey: "hdojFa502Uy6nG2",
            message,
            recipients: phoneNumbers.split(", "), // Split back into an array for recipients
            senderid: "REMS",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error sending OTP:", response.status, errorText);
        toast.error("Failed to send OTP.");
        return false;
      }

      toast.success("Message sent successfully!");
      return true;
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Could not send OTP. Please check your connection.");
      return false;
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    console.log("Message sent:", message);

    await sendSmsBroadcast(); // Call the SMS sending function
    setMessage("");
    await getDrivers(); // Refresh the driver list after sending
  };

  useEffect(() => {
    getDrivers(); // Fetch drivers on component mount
  }, []);

  return (
    <div className="dashboard">
      <Navbar />
      <Container fluid className="d-flex">
        <Row className="w-100">
          <Col md={8} className="mx-auto mt-4 text-center">
            <h2>
            <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#FFD700", // Golden color for the icon
                    fontSize: "24px",
                    marginRight: "10px",
                    marginTop: "35px" // Space between button and title
                  }}
                  onClick={() => navigate(-1)} // Navigate back to the previous page
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>
              Broadcast Message</h2>
            <Form onSubmit={handleSend} style={{ marginTop: "35%" }}>
              <Form.Group controlId="messageInput">
                <Form.Control
                  type="text"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="mb-2"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Send
              </Button>
            </Form>
          </Col>
          <Col md={4} className="mt-4">
            <SideBar />
          </Col>
        </Row>
      </Container>
      <Footer />
      <ToastContainer /> {/* Toast container for notifications */}
    </div>
  );
};

export default Broadcast;