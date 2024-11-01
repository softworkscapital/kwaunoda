import React from 'react';
import MapView from './MapView';
import Navbar from './Navbar';


const MainContent = ({ selectedTrip }) => {
  return (
    <div className="main-content">
     
      <div className="map-container">
        <MapView selectedTrip={selectedTrip} /> {/* Pass selectedTrip down */}
      </div>
    </div>
  );
};

export default MainContent;