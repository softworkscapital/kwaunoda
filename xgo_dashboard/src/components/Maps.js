import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const Maps = () => {
    const [pointA, setPointA] = useState(null); // Point A
    const [pointB, setPointB] = useState(null); // Point B
    const [selectedPoint, setSelectedPoint] = useState(null); // Track which point is being selected
    const [isSelectingA, setIsSelectingA] = useState(true); // Track if selecting A or B
    const [directions, setDirections] = useState(null); // To hold directions data
    const [directionsFetched, setDirectionsFetched] = useState(false); // Track if directions have been fetched

    const initialCenter = { lat: -17.8292, lng: 31.0522 }; // Harare coordinates

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const latA = parseFloat(params.get('latA'));
        const lngA = parseFloat(params.get('lngA'));
        const latB = parseFloat(params.get('latB'));
        const lngB = parseFloat(params.get('lngB'));

        if (!isNaN(latA) && !isNaN(lngA)) {
            setPointA({ lat: latA, lng: lngA });
        }
        if (!isNaN(latB) && !isNaN(lngB)) {
            setPointB({ lat: latB, lng: lngB });
        }
    }, []);

    const directionsCallback = (response) => {
        if (response && response.status === 'OK') {
            setDirections(response);
            setDirectionsFetched(true);
        } else {
            console.error('Error fetching directions:', response);
            alert('Failed to fetch directions. Please try again.');
        }
    };

    const handleMapClick = (event) => {
        const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setSelectedPoint(newPoint); // Set the point to be confirmed
    };

    const confirmPointA = () => {
        setPointA(selectedPoint);
        setSelectedPoint(null);
        setIsSelectingA(false); // Move to select Point B
    };

    const confirmPointB = () => {
        setPointB(selectedPoint);
        setSelectedPoint(null);

        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ pointA, pointB: selectedPoint }));
        } else {
            console.error('ReactNativeWebView is not defined');
        }
    };

    const handleRedo = () => {
        setPointA(null);
        setPointB(null);
        setSelectedPoint(null);
        setIsSelectingA(true);
        setDirections(null);
        setDirectionsFetched(false);
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE"> {/* Replace with your API key */}
            <GoogleMap
                id="example-map"
                mapContainerStyle={{ height: '400px', width: '800px' }}
                zoom={14}
                center={pointA ? pointA : initialCenter} // Center on Point A if confirmed, otherwise on Harare
                onClick={isSelectingA || pointA ? handleMapClick : null} // Allow clicking when selecting A or after A is selected
            >
                {pointA && <Marker position={pointA} label="A" />}
                {pointB && <Marker position={pointB} label="B" />}
                {selectedPoint && <Marker position={selectedPoint} label="Selected" color="blue" />} {/* Location marker for selected point */}

                {/* Directions Service */}
                {pointA && pointB && !directionsFetched && (
                    <DirectionsService
                        options={{
                            destination: pointB,
                            origin: pointA,
                            travelMode: 'DRIVING',
                        }}
                        callback={directionsCallback}
                    />
                )}

                {/* Directions Renderer */}
                {directions && (
                    <DirectionsRenderer
                        options={{
                            directions: directions,
                            suppressMarkers: true, // Suppress default markers
                        }}
                    />
                )}
            </GoogleMap>

            <div>
                {isSelectingA && pointA === null && (
                    <>
                        <p>Select Point A:</p>
                        {selectedPoint && <p>Selected Point: {selectedPoint.lat}, {selectedPoint.lng}</p>}
                        {selectedPoint && <button onClick={confirmPointA}>Confirm Point A</button>}
                    </>
                )}
                {!isSelectingA && pointB === null && (
                    <>
                        <p>Select Point B:</p>
                        {selectedPoint && <p>Selected Point: {selectedPoint.lat}, {selectedPoint.lng}</p>}
                        {selectedPoint && <button onClick={confirmPointB}>Confirm Point B</button>}
                    </>
                )}
                {pointA && pointB && (
                    <button onClick={handleRedo}>Redo</button>
                )}
            </div>
        </LoadScript>
    );
};

export default Maps;