// Confirmation.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
    const location = useLocation();
    const { startLocation, destination } = location.state || {};
    const { point, coordinates } = location.state || {};

    const handleConfirm = () => {
        // Implement the logic to send coordinates back to React Native app
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ startLocation, destination, coordinates }));
        } else {
            console.error('ReactNativeWebView is not defined');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Confirm Locations</h1>
            <p>Start Location: {startLocation}</p>
            <p>Destination: {destination}</p>
            <p>Selected {point}: {coordinates ? `${coordinates.lat}, ${coordinates.lng}` : 'Not selected'}</p>
            <button onClick={handleConfirm}>Confirm Locations</button>
        </div>
    );
};

export default Confirmation;