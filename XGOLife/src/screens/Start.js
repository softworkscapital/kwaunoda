import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Start = () => {
  const navigation = useNavigation();
  const scaleAnimation = useRef(new Animated.Value(0)).current; // For scaling
  const opacityAnimation = useRef(new Animated.Value(0)).current; // For opacity

  useEffect(() => {
    // Start the animations
    Animated.parallel([
      Animated.timing(opacityAnimation, {
        toValue: 1, // Fade in
        duration: 2000, // Duration of the fade-in animation
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 2, // Scale to double the size
        duration: 2000, // Duration of the scaling
        useNativeDriver: true,
      }),
    ]).start();

    // Wait for 4 seconds after the fade-in
    const timer = setTimeout(async () => {
      const theIds = await AsyncStorage.getItem("theIds"); // Check for theIds in local storage
      console.log("theIds:", theIds); // Log theIds to the console

      // Check if theIds exists
      if (theIds) {
        const userId = await AsyncStorage.getItem("theCustomerId");
        const driverId = await AsyncStorage.getItem("driver");

        // Redirect to Home if userId or driverId exists
        if (userId || driverId) {
          navigation.navigate("CustomerLogin");
        } else {
          navigation.navigate("SplashScreen");
        }
      } else {
        // Redirect to SplashScreen if theIds does not exist
        navigation.navigate("SplashScreen");
      }
    }, 4000); // Wait for 4 seconds

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [scaleAnimation, navigation, opacityAnimation]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={{
          transform: [
            { scale: scaleAnimation }, // Scale animation
          ],
          opacity: opacityAnimation,
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../thumbnails/xgologofootertext.png')}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, 
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
  },
});

export default Start;