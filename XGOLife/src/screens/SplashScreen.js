import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library

const CombinedSplashScreen = () => {
  const navigation = useNavigation();
  const [currentScreen, setCurrentScreen] = useState(0); // Track current screen

  const screens = [
    {
      heading: "Welcome to XGoLife!",
      description: "Welcome to XGoLife, From small parcels to large orders.",
      image: require('../thumbnails/biker.png'),
    },
    {
      heading: "From small parcels to large orders.",
      description: "XGoLife delivers it all with care and efficiency.",
      image: require('../thumbnails/box.png'), // Image for screen 2
    },
    {
      heading: "In Time, On Time!",
      description: "Experience swift and reliable delivery right to your doorstep with XGoLife.",
      image: require('../thumbnails/deliveryman.png'), // Image for screen 3
    },
    {
      heading: "Shop Online with Ease!",
      description: "Explore our wide range of products available for delivery.",
      image: require('../thumbnails/biker.png'), // Same image for screen 4
    },
    {
      heading: "Ride Hailing Made Simple!",
      description: "Quickly request rides at your convenience with XGoLife.",
      image: require('../thumbnails/biker.png'), // Same image for screen 5
    },
  ];

  const goToNextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      navigation.navigate("CustomerLogin"); // Final navigation
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={screens[currentScreen].image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>{screens[currentScreen].heading}</Text>
        <Text style={styles.description}>{screens[currentScreen].description}</Text>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.circleContainer}>
          {screens.map((_, index) => (
            <View key={index} style={[styles.roundedView, currentScreen === index ? { backgroundColor: 'black' } : { backgroundColor: 'white' }]}></View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={goToNextScreen}>
          <Text style={styles.buttonText}>
            {currentScreen < screens.length - 1 ? "Next" : "Get Started"}
          </Text>
          <Icon name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC000',
    justifyContent: 'space-between',
    padding: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    height: 200,
    width: 200,
    marginBottom: 20, // Space between image and text
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20, // Space below text
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#002966',
    textAlign: 'center',
    marginBottom: 10, // Space between title and description
  },
  description: {
    fontSize: 14,
    color: '#002966',
    textAlign: 'center',
  },
  bottomContainer: {
    alignItems: 'center',
  },
  circleContainer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 40,
  },
  roundedView: {
    backgroundColor: 'white',
    height: 10,
    width: 10,
    borderRadius: 10,
    marginLeft: 4,
    marginRight: 4,
  },
  button: {
    backgroundColor: "#002966",
    borderRadius: 50,
    padding: 14,
    width: "100%",
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
  },
  buttonIcon: {
    alignSelf: 'center',
  },
});

export default CombinedSplashScreen;