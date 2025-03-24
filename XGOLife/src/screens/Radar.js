import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

const DriverScanningAnimation = () => {
  const [drivers, setDrivers] = useState([]);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }), // Faster rotation
      Infinity,
      false
    );

    const generateDriver = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 35 + 5;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      const newDriver = { id: Date.now(), x, y };
      setDrivers((prev) => [...prev, newDriver]);

      setTimeout(() => {
        setDrivers((prev) => prev.filter(driver => driver.id !== newDriver.id));
      }, 1000); // Driver blip lasts for 1 second
    };

    const interval = setInterval(generateDriver, 1200); // Generate a new driver every 1.2 seconds

    return () => {
      clearInterval(interval);
    };
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
   
      <View style={styles.baseCircle} />
      <Animated.View style={[styles.scanningLine, animatedStyle]} />
      {drivers.map(driver => (
        <Animated.View
          key={driver.id}
          style={[
            styles.driverBlip,
            {
              left: `calc(50% + ${driver.x}%)`,
              top: `calc(50% + ${driver.y}%)`,
            },
          ]}
        />
      ))}
      <View style={styles.centerDot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanningText: {
    position: 'absolute',
    top: 10,
    fontSize: 16,
    color: '#ffc000', // Adjust color as needed
  },
  baseCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 192, 0, 0.3)',
  },
  scanningLine: {
    position: 'absolute',
    width: '50%',
    height: 2,
    backgroundColor: 'rgba(255, 192, 0, 0.5)',
    top: '50%',
    left: '50%',
    transformOrigin: '0% 50%',
  },
  driverBlip: {
    position: 'absolute',
    width: 8, // Slightly larger for drivers
    height: 8,
    backgroundColor: '#00ff00', // Green for available drivers
    borderRadius: 4,
  },
  centerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffc000',
  },
});

export default DriverScanningAnimation;