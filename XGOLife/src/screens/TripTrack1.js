import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  Clock,
  MapPin,
  Navigation2,
  TrendingUp,
  Truck,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {API_URL} from './API_URL';


const TripTracker = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(true);
  const [directions, setDirections] = useState(null);
  const [driver1, setDriver1] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isOffRoute, setIsOffRoute] = useState(false);
  // const APILINK = "https://srv547457.hstgr.cloud:3011"; // Replace with your actual API URL

  // Custom car marker SVG
  const carMarkerIcon = {
    path: "M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.064-.667.268-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z",
    fillColor: "#ffc000",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#000000",
    rotation: 0,
    scale: 1,
  };

  // Haversine formula to calculate distance
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };
  const calculateETA = () => {
    if (driverLocation && tripData) {
      const destinationLat = tripData[0].destination_lat;
      const destinationLng = tripData[0].destination_long;

      const distanceToDestination = haversineDistance(
        driverLocation.latitude,
        driverLocation.longitude,
        destinationLat,
        destinationLng,
      );

      const averageSpeed = 60; // Average speed in km/h
      const etaMinutes = (distanceToDestination / averageSpeed) * 60; // Convert hours to minutes

      return {
        distance: distanceToDestination,
        eta: etaMinutes,
        percentageComplete: (distanceToDestination / tripData[0].distance) * 100, // Assuming tripData[0].distance is in km
      };
    }
    return { distance: 0, eta: 0, percentageComplete: 0 };
  };
  const { distance, eta, percentageComplete } = calculateETA();
  // Check if driver is off route
  const checkIfOffRoute = (driverPos, routePoints) => {
    if (!routePoints || !driverPos) return false;

    const threshold = 0.1; // 100 meters threshold
    return !routePoints.some(
      (point) =>
        haversineDistance(
          driverPos.lat,
          driverPos.lng,
          point.lat(),
          point.lng()
        ) <= threshold
    );
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/trip/${tripId}`);
        const data = await response.json();
        setTripData(data);
      } catch (error) {
        console.error("Error fetching trip details:", error);
      }
    };

    fetchTripDetails();
  }, [tripId, API_URL]);

  useEffect(() => {
    if (tripData) {
      const fetchDriverLocation = async () => {
        try {
          const response = await fetch(
            `${API_URL}/driver/${tripData[0].driver_id}`
          );
          const driverArray = await response.json();
          if (Array.isArray(driverArray) && driverArray.length > 0) {
            const driver = driverArray[0];
            setDriver1(driver);
            const lat = parseFloat(driver.lat_cordinates);
            const lng = parseFloat(driver.long_cordinates);
            if (!isNaN(lat) && !isNaN(lng)) {
              setDriverLocation({ latitude: lat, longitude: lng });
            } else {
              console.error("Invalid coordinate values:", driver);
            }
          } else {
            console.error("No driver data found or unexpected format");
          }
        } catch (error) {
          console.error("Error fetching driver location:", error);
        } finally {
          setLoadingDriver(false);
        }
      };

      fetchDriverLocation(); // Initial fetch
      const intervalId = setInterval(fetchDriverLocation, 5000); // Fetch every 5 seconds

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [tripData, API_URL]);

  useEffect(() => {
    if (mapLoaded && tripData) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(
            tripData[0].origin_location_lat,
            tripData[0].origin_location_long
          ),
          destination: new window.google.maps.LatLng(
            tripData[0].destination_lat,
            tripData[0].destination_long
          ),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Error fetching directions:", result);
          }
        }
      );
    }
  }, [mapLoaded, tripData]);

  useEffect(() => {
    if (directions && driverLocation) {
      const route = directions.routes[0].overview_path;
      const driverPos = {
        lat: driverLocation.latitude,
        lng: driverLocation.longitude,
      };
      const offRoute = checkIfOffRoute(driverPos, route);
      setIsOffRoute(offRoute);
    }
  }, [directions, driverLocation]);

  const mapContainerStyle = {
    height: "500px",
    width: "100%",
    borderRadius: "1rem",
  };

  const center = driverLocation
    ? { lat: driverLocation.latitude, lng: driverLocation.longitude }
    : {
        lat: tripData?.[0]?.origin_location_lat || 0,
        lng: tripData?.[0]?.origin_location_long || 0,
      };

  // Render loading state if trip data or driver location is not loaded
  if (!tripData || loadingDriver) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {isOffRoute && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg flex items-center space-x-2"
          >
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <span className="text-red-600 dark:text-red-400">
              Driver is off the designated route!
            </span>
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <LoadScript
            googleMapsApiKey="AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE" // Replace with your actual Google Maps API key
            onLoad={() => setMapLoaded(true)}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                styles: [
                  {
                    featureType: "all",
                    elementType: "geometry",
                    stylers: [{ saturation: -80 }],
                  },
                ],
              }}
            >
              {tripData && (
                <>
                  <Marker
                    position={{
                      lat: tripData[0].origin_location_lat,
                      lng: tripData[0].origin_location_long,
                    }}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    }}
                  />
                  <Marker
                    position={{
                      lat: tripData[0].destination_lat,
                      lng: tripData[0].destination_long,
                    }}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                  />
                  {driverLocation && (
                    <Marker
                      position={{
                        lat: driverLocation.latitude,
                        lng: driverLocation.longitude,
                      }}
                      icon={carMarkerIcon}
                    />
                  )}
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: "#ffc000",
                          strokeWeight: 5,
                          strokeOpacity: 0.8,
                        },
                      }}
                    />
                  )}
                </>
              )}
            </GoogleMap>
          </LoadScript>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-[#ffc000]" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From
                  </p>
                  <p className="font-medium dark:text-white">
                    {tripData[0]?.origin_location || "Loading..."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <Navigation2 className="w-6 h-6 text-[#ffc000]" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                  <p className="font-medium dark:text-white">
                    {tripData[0]?.dest_location || "Loading..."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-[#ffc000]" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Distance
                  </p>
                  <p className="font-medium dark:text-white">
                    {tripData[0]?.distance || "Loading..."}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-[#ffc000]" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ETA
                  </p>
                  <p className="font-medium dark:text-white">
                    {Math.round(eta)} minutes
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center space-x-4">
              <Truck className="w-8 h-8 text-[#ffc000]" />
              <div>
                <p className="font-medium dark:text-white">
                  {driver1?.name || "Loading..."}{" "}
                  {driver1?.surname || "Loading..."}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {driver1?.model || "Loading..."}-
                  {driver1?.make || "Loading..."}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div
                  className="bg-[#ffc000] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentageComplete.toFixed(2)}%` }} // Example progress calculation
                ></div>
              </div>
              <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                {percentageComplete.toFixed(2)}% Complete
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TripTracker;
