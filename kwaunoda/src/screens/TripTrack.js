import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Animated } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";
import { API_URL } from "./config";

const AnimatedMarker = ({ coordinate }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const startAnimation = () => {
      animation.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [animation]);

  const interpolatedColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["blue", "lightblue"]
  });

  return (
    <Marker coordinate={coordinate}>
      <Animated.View style={{ backgroundColor: interpolatedColor, padding: 10, borderRadius: 15 }}>
        <View style={styles.carIcon} />
      </Animated.View>
    </Marker>
  );
};

const TripTrack = ({ route }) => {
  const { trip } = route.params;
  const [decodedPath, setDecodedPath] = useState([]);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loadingDriver, setLoadingDriver] = useState(true);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const driverId = trip.driver_id;
  const APILINK = API_URL;

  const origin = {
    latitude: trip.origin_location_lat,
    longitude: trip.origin_location_long,
  };

  const destination = {
    latitude: trip.destination_lat,
    longitude: trip.destination_long,
  };

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=AIzaSyA4ZQWDwYRHmhu66Cb1F8DgXbJJrArHYyE`
        );
        const data = await response.json();

        if (data.routes.length > 0) {
          const points = data.routes[0].overview_polyline.points;
          const path = polyline.decode(points).map(([latitude, longitude]) => ({
            latitude,
            longitude,
          }));
          setDecodedPath(path);
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      } finally {
        setLoadingRoute(false);
      }
    };

    const fetchDriverLocation = async () => {
      try {
        const response = await fetch(`${APILINK}/driver/${driverId}`);
        const driverArray = await response.json();
    
        if (Array.isArray(driverArray) && driverArray.length > 0) {
          const driver = driverArray[0];
          if (driver.lat_cordinates !== undefined && driver.long_cordinates !== undefined) {
            setDriverLocation({
              latitude: driver.lat_cordinates,
              longitude: driver.long_cordinates,
            });
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

    fetchDriverLocation(); 
    fetchRoute(); 

    // const intervalId = setInterval(fetchDriverLocation, 5000);

    // return () => clearInterval(intervalId);
  }, [origin, destination, driverId, APILINK]);

  if (loadingDriver) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (origin.latitude + destination.latitude) / 2,
          longitude: (origin.longitude + destination.longitude) / 2,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={origin} title="Origin" />
        <Marker coordinate={destination} title="Destination" />
        {driverLocation && (
          <AnimatedMarker coordinate={driverLocation} />
        )}
        {decodedPath.length > 0 && (
          <Polyline
            coordinates={decodedPath}
            strokeColor="#000"
            strokeWidth={3}
          />
        )}
      </MapView>
      {loadingRoute && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  carIcon: {
    height: 30,
    width: 30,
    backgroundColor: 'blue',
    borderRadius: 15,
  },
});

export default TripTrack;