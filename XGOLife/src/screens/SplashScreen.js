import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const CombinedSplashScreen = () => {
  const navigation = useNavigation();
  const [currentScreen, setCurrentScreen] = useState(0); 

  const screens = [
    {
      heading: "Welcome to XGoLife!",
      description: "Welcome to XGoLife, From small parcels to large orders.",
      image: require('../thumbnails/biker.png'),
    },
    {
      heading: "From small parcels to large orders.",
      description: "XGoLife delivers it all with care and efficiency.",
      image: require('../thumbnails/box.png'), 
    },
    {
      heading: "In Time, On Time!",
      description: "Experience swift and reliable delivery right to your doorstep with XGoLife.",
      image: require('../thumbnails/deliveryman.png'), 
    },
    {
      heading: "24/7 Online Shopping\nNon Stop!",
      description: "Explore our wide range of products available for delivery.",
      image: require('../thumbnails/shop3.png'), 
    },
    {
      heading: "Book A Ride!",
      description: "Quickly request rides at your convenience with XGoLife.",
      image: require('../thumbnails/ride_hailing1.png'), 
    },
  ];

  const goToNextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      navigation.navigate("SignUp"); 
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
    height: 250,
    width: 250,
    marginBottom: 20, 
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#002966',
    textAlign: 'center',
    marginBottom: 10,
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