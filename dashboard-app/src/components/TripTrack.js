import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css'; // Import geocoder CSS
import 'leaflet-control-geocoder'; // Import geocoder
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

// Default icon for markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker for the driver
const DriverMarker = ({ position }) => {
    const icon = L.divIcon({
        className: 'custom-driver-icon',
        html: '<i class="fas fa-car" style="color: red; font-size: 24px;"></i>', // Car icon
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    return (
        <Marker position={position} icon={icon}>
            <Popup>
                Driver: {position[0]}, {position[1]}
            </Popup>
        </Marker>
    );
};

const RoutingControl = ({ driverPosition, position1, position2 }) => {
    const map = useMap();

    useEffect(() => {
        if (!driverPosition || !position1 || !position2) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(driverPosition[0], driverPosition[1]),
                L.latLng(position1[0], position1[1]),
                L.latLng(position2[0], position2[1])
            ],
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim(),
        }).addTo(map);

        map.fitBounds([driverPosition, position1, position2]);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, driverPosition, position1, position2]);

    return null;
};

const MapViewWithDriver = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    
    const latDriver = parseFloat(params.get('latDriver'));
    const lngDriver = parseFloat(params.get('lngDriver'));
    const lat1 = parseFloat(params.get('lat1'));
    const lng1 = parseFloat(params.get('lng1'));
    const lat2 = parseFloat(params.get('lat2'));
    const lng2 = parseFloat(params.get('lng2'));

    const isValidCoordinates = !isNaN(latDriver) && !isNaN(lngDriver) && !isNaN(lat1) && !isNaN(lng1) && !isNaN(lat2) && !isNaN(lng2);

    const driverPosition = isValidCoordinates ? [latDriver, lngDriver] : [0, 0];
    const position1 = isValidCoordinates ? [lat1, lng1] : [0, 0];
    const position2 = isValidCoordinates ? [lat2, lng2] : [0, 0];

    if (!isValidCoordinates) {
        return <div>Please provide valid coordinates in the URL.</div>;
    }

    return (
        <MapContainer center={driverPosition} zoom={13} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <DriverMarker position={driverPosition} />
            <Marker position={position1}>
                <Popup>
                    Location 1: {lat1}, {lng1}
                </Popup>
            </Marker>
            <Marker position={position2}>
                <Popup>
                    Location 2: {lat2}, {lng2}
                </Popup>
            </Marker>
            <RoutingControl driverPosition={driverPosition} position1={position1} position2={position2} />
        </MapContainer>
    );
};

export default MapViewWithDriver;