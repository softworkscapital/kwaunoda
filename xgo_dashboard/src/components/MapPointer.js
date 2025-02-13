import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate, useParams } from 'react-router-dom';

const Map = () => {
    const [selectedPoint, setSelectedPoint] = useState(null);
    const navigate = useNavigate();
    const { point } = useParams(); // Either 'A' or 'B'

    const handleMapClick = (event) => {
        const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setSelectedPoint(newPoint);
    };

    const confirmPoint = () => {
        if (selectedPoint) {
            // Save coordinates to localStorage
            if (point === 'A') {
                localStorage.setItem('startCoordinates', `${selectedPoint.lat}, ${selectedPoint.lng}`);
            } else {
                localStorage.setItem('destinationCoordinates', `${selectedPoint.lat}, ${selectedPoint.lng}`);
            }

            // Navigate back to Home
            navigate('/home');
        } else {
            alert('Please select a point on the map.');
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <LoadScript googleMapsApiKey="AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE">
                <GoogleMap
                    id="map"
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    zoom={14}
                    center={{ lat: -17.8292, lng: 31.0522 }} // Center on Harare
                    onClick={handleMapClick}
                >
                    {selectedPoint && <Marker position={selectedPoint} />}
                </GoogleMap>
            </LoadScript>
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                zIndex: 1000, // Ensure it stays on top of the map
            }}>
                <button onClick={confirmPoint} style={{ width: '100%' }}>
                    Confirm Point {point}
                </button>
            </div>
        </div>
    );
};

export default Map;