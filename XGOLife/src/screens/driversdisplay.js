import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { API_URL } from './API_URL';
import carIcon from './—Pngtree—yellow car top view_14599687.png'; // Import your car icon

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const Driversdisplay = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const mapRef = useRef(null);
  const [previousDriverStates, setPreviousDriverStates] = useState({});

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await fetch(`${API_URL}/driver`);
        const data = await response.json();
        
        const updatedDrivers = data.map(driver => {
          const previous = previousDriverStates[driver.driver_id];
          let bearing = null;
          
          if (previous) {
            bearing = calculateBearing(previous.lat_cordinates, previous.long_cordinates, driver.lat_cordinates, driver.long_cordinates);
          }
          
          return { ...driver, bearing };
        });
        
        setDrivers(updatedDrivers);
        setPreviousDriverStates(prevStates => {
          const newStates = { ...prevStates };
          data.forEach(driver => {
            newStates[driver.id] = { lat_cordinates: driver.lat_cordinates, long_cordinates: driver.long_cordinates };
          });
          return newStates;
        });
      } catch (error) {
        console.error('Error fetching driver data:', error);
      }
    };

    fetchDriverData();
    const interval = setInterval(fetchDriverData, 5000);

    return () => clearInterval(interval);
  }, [previousDriverStates]);

  const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const toDegrees = (radians) => (radians * 180) / Math.PI;

    const dLon = toRadians(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
    const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
              Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);
    const bearing = toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360; // normalize to 0-360
  };

  return (
    <div className="relative h-screen">
      <LoadScript
        googleMapsApiKey="AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE"
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={drivers.length > 0 ? drivers[0] : { lat: -17.8292, lng: 31.0522 }}
          zoom={15}
          onLoad={(map) => (mapRef.current = map)}
        >
          {drivers.map((driver, index) => (
            <Marker
              key={index}
              position={{ lat: driver.lat_cordinates, lng: driver.long_cordinates }}
              icon={{
                url: carIcon, // Use the car image as the icon
                scaledSize: new window.google.maps.Size(30, 30), // Adjust size accordingly
                rotation: driver.bearing || 0, // Rotate based on bearing
              }}
              onClick={() => setSelectedDriver(driver)}
            />
          ))}
          {selectedDriver && (
            <InfoWindow
              position={{
                lat: selectedDriver.lat_cordinates,
                lng: selectedDriver.long_cordinates,
              }}
              onCloseClick={() => setSelectedDriver(null)}
            >
              <div>
                <h2>{selectedDriver.name}</h2>
                <p>Direction: {selectedDriver.bearing ? `${selectedDriver.bearing.toFixed(2)}°` : 'N/A'}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Driversdisplay;