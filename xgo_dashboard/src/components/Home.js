import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from '@react-google-maps/api';

const Home = () => {
    const navigate = useNavigate();
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [startCoordinates, setStartCoordinates] = useState(null);
    const [destinationCoordinates, setDestinationCoordinates] = useState(null);
    const [directions, setDirections] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Load Google Maps API
    useEffect(() => {
        const loadMap = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE&libraries=places`;
            script.async = true;
            script.onload = () => setMapLoaded(true);
            document.body.appendChild(script);
        };
        loadMap();
    }, []);

    useEffect(() => {
        // Retrieve coordinates from localStorage
        const startCoords = localStorage.getItem('startCoordinates');
        const destCoords = localStorage.getItem('destinationCoordinates');

        if (startCoords) {
            const [lat, lng] = startCoords.split(',').map(Number);
            setStartCoordinates({ lat, lng });
            setStartLocation(startCoords);
        }
        if (destCoords) {
            const [lat, lng] = destCoords.split(',').map(Number);
            setDestinationCoordinates({ lat, lng });
            setDestination(destCoords);
        }
    }, []);

    const navigateToMap = useCallback((point) => {
        navigate(`/map/${point}`);
    }, [navigate]);

    const handleConfirm = useCallback(() => {
        if (startCoordinates && destinationCoordinates) {
            const dataToSend = {
                pointA: { lat: startCoordinates.lat, lng: startCoordinates.lng },
                pointB: { lat: destinationCoordinates.lat, lng: destinationCoordinates.lng },
            };

            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify(dataToSend));
            } else {
                console.log('Coordinates confirmed:', dataToSend);
            }
        } else {
            alert('Please select both start and destination locations.');
        }
    }, [startCoordinates, destinationCoordinates]);

    const fetchDirections = useCallback(() => {
        if (mapLoaded && startCoordinates && destinationCoordinates) {
            console.log('Fetching directions...');
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: startCoordinates,
                    destination: destinationCoordinates,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    console.log('Directions status:', status);
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions: ${result}`);
                    }
                }
            );
        } else {
            console.log('Waiting for coordinates or map to load...');
        }
    }, [mapLoaded, startCoordinates, destinationCoordinates]);

    useEffect(() => {
        fetchDirections();
    }, [fetchDirections]);

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <LoadScript googleMapsApiKey="AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE">
                <GoogleMap
                    id="map"
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    zoom={14}
                    center={{ lat: -17.8292, lng: 31.0522 }} // Center on Harare
                >
                    {directions && <DirectionsRenderer directions={directions} />}
                    {startCoordinates && <Marker position={startCoordinates} />}
                    {destinationCoordinates && <Marker position={destinationCoordinates} />}
                </GoogleMap>
            </LoadScript>

            <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                backgroundColor: 'white',
                padding: '20px',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.3)',
            }}>
                <h2>Location Picker</h2>
                <input
                    type="text"
                    placeholder="Start Location"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                />
                <button onClick={() => navigateToMap('A')}>Pick Start Location on Map</button>
                <br />
                <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <button onClick={() => navigateToMap('B')}>Pick Destination on Map</button>
                <br />
                <button onClick={handleConfirm}>Confirm Locations</button>
            </div>
        </div>
    );
};

export default Home;