import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Import geocoder CSS
import 'leaflet-control-geocoder'; // Import geocoder

// Default icon for markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RoutingControl = ({ position1, position2 }) => {
    const map = useMap();

    useEffect(() => {
        if (!position1 || !position2) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(position1[0], position1[1]),
                L.latLng(position2[0], position2[1])
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim(), // Ensure this is correctly referenced
        }).addTo(map);

        // Fit map to the route
        map.fitBounds([position1, position2]);

        // Clean up on unmount
        return () => {
            map.removeControl(routingControl);
        };
    }, [map, position1, position2]);

    return null;
};

const MapView = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const lat1 = parseFloat(params.get('lat1'));
    const lng1 = parseFloat(params.get('lng1'));
    const lat2 = parseFloat(params.get('lat2'));
    const lng2 = parseFloat(params.get('lng2'));

    const isValidCoordinates = !isNaN(lat1) && !isNaN(lng1) && !isNaN(lat2) && !isNaN(lng2);

    const position1 = isValidCoordinates ? [lat1, lng1] : [0, 0];
    const position2 = isValidCoordinates ? [lat2, lng2] : [0, 0];

    if (!isValidCoordinates) {
        return <div>Please provide valid coordinates in the URL.</div>;
    }

    return (
        <MapContainer center={position1} zoom={13} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position1}>
                <Popup>
                    Start: {lat1}, {lng1}
                </Popup>
            </Marker>
            <Marker position={position2}>
                <Popup>
                    End: {lat2}, {lng2}
                </Popup>
            </Marker>
            <RoutingControl position1={position1} position2={position2} />
        </MapContainer>
    );
};

export default MapView;