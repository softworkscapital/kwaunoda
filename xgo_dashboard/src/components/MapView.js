import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { API_URL,API_URL_UPLOADS,GOOGLE_MAPS_API_KEY } from './config';
import motorcycleIcon from '../assets/black-motorcycle.png';

const MapView = ({ selectedTrip }) => {
  const [markers, setMarkers] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [route, setRoute] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -17.8252, lng: 31.0335 }); // Initial center
  const [pickedLocation, setPickedLocation] = useState(null); // New state for picked location
  const APILINK = API_URL;

  const getDrivers = async () => {
    try {
      const response = await fetch(`${APILINK}/driver/`);
      const data = await response.json();
      const newMarkers = data.map((driver) => ({
        lat: parseFloat(driver.lat_cordinates),
        lng: parseFloat(driver.long_cordinates),
        driver_id: driver.driver_id,
        plate: driver.plate,
        name: driver.name,
        surname: driver.surname,
        rating: driver.rating,
        profilePic: driver.profilePic,
        status: driver.membershipstatus
        


      }));
 console.log("newMarkers",data);
      setMarkers(newMarkers);
      setDriversData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const decodePolyline = (polyline) => {
    const coordinates = [];
    let index = 0, len = polyline.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result >> 1) ^ -(result & 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = polyline.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result >> 1) ^ -(result & 1));
      lng += dlng;

      coordinates.push({ lat: lat / 1E5, lng: lng / 1E5 });
    }
    return coordinates;
  };

  const getDirections = async (origin, destination) => {
    try {
      const response = await fetch(`/api/directions/json?` + new URLSearchParams({
        origin: `${origin.latitude},${origin.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        key: GOOGLE_MAPS_API_KEY,
        mode: 'driving',
      }));

      if (!response.ok) {
        const text = await response.text();
        console.error('Error fetching directions:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "OK" && result.routes.length > 0) {
        const points = decodePolyline(result.routes[0].overview_polyline.points);
        setRoute(points);
      } else {
        console.log("No routes found or an error occurred.");
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  useEffect(() => {
    getDrivers();
    const interval = setInterval(() => {
      getDrivers();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Pitch = (selectedTrip) => {
    if (selectedTrip) {
      const origin = {
        latitude: parseFloat(selectedTrip.origin_location_lat),
        longitude: parseFloat(selectedTrip.origin_location_long),
      };
      const destination = {
        latitude: parseFloat(selectedTrip.destination_lat),
        longitude: parseFloat(selectedTrip.destination_long),
      };

      if (!isNaN(origin.latitude) && !isNaN(origin.longitude) && !isNaN(destination.latitude) && !isNaN(destination.longitude)) {
        setStartLocation(origin);
        setEndLocation(destination);
        getDirections(origin, destination);
      } else {
        console.error('Invalid coordinates:', origin, destination);
      }
    }
  };

  useEffect(() => {
    Pitch(selectedTrip);
  }, [selectedTrip]);

  // Handle map click to set picked location
  const handleMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setPickedLocation({ lat, lng });
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div style={{ width: '100%', height: '100vh' }}>
        <GoogleMap
          onLoad={(map) => setMapCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() })}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={13}
          options={{
            scrollwheel: true,
            gestureHandling: 'auto',
          }}
          onClick={handleMapClick} // Add click handler
        >
          {markers.map((marker, index) => (
            <Marker 
              key={index} 
              position={marker} 
              icon={{ url: motorcycleIcon, scaledSize: new window.google.maps.Size(80, 80) }} // Use your custom icon path
            
              onClick={() => setSelectedDriver(marker)}
            />
          ))}
          
          {selectedDriver && (
<InfoWindow 
  position={{ lat: selectedDriver.lat, lng: selectedDriver.lng }} 
  onCloseClick={() => setSelectedDriver(null)}
>
  <div>
                <div className="image-preview-container" align="center">
                <img
                src={`${API_URL_UPLOADS}/${selectedDriver.profilePic .replace(/\\/g, '/')}`}
                style={{
                width: "80px",
                borderRadius: "30px",
                height: "auto",
                cursor: "pointer",
                marginRight: "10px",
                }}
                />
                </div>
    <h6>Name :{selectedDriver.name} {selectedDriver.surname}</h6>
    <div>USER ID: {selectedDriver.driver_id}</div>
    <div>No. Plate: {selectedDriver.plate}{"\n"}</div>
  
    {/* Displaying stars based on rating */}
    <div>Rated :
      {Array.from({ length: 5 }, (v, i) => (
        <span key={i} style={{ color: i < selectedDriver.rating ? 'gold' : 'lightgray' }}>
          ★
        </span>
      ))}
    </div>

    

    <p>Status: {selectedDriver.status || 'N/A'}</p>
  </div>
</InfoWindow>
          )}

          {/* Start Location Marker (Origin) */}
          {startLocation && (
            <Marker 
              position={startLocation}
               // Use your custom icon path
            
            />
          )}

          {/* End Location Marker (Destination) */}
          {endLocation && (
            <Marker 
              position={endLocation}
              // Use your custom icon path
           
            />
          )}

          {/* Picked Location Marker */}
          {pickedLocation && (
            <Marker 
              position={pickedLocation} 
       e your custom icon path
            />
          )}

          {route.length > 0 && (
            <Polyline
              path={route}
              options={{ 
                strokeColor: '#FF0000',
                strokeOpacity: 1,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapView;