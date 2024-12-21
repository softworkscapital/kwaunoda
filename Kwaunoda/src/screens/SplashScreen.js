import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const bikeAnimation = useRef(new Animated.Value(-200)).current; // Start position above the screen

  useEffect(() => {
    Animated.timing(bikeAnimation, {
      topValue: 0, // End position at the desired location
      duration: 500, // Duration of the animation
      useNativeDriver: true,
    }).start();
  }, []);

  const redirectSplashScreen2 = () => {
    navigation.navigate("SplashScreen2");
  };

  const redirectCustomerLogin = () => {
    navigation.navigate("CustomerLogin");
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateX: bikeAnimation }] }}>
        <View style={{justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={{ height: 200, width: 200}}
            source={require('../thumbnails/biker.png')}
          />
        </View>
      </Animated.View>

      <Text style={styles.description}>
        Welcome to DropX! Your reliable delivery partner.
      </Text>

      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.roundedView, { backgroundColor: 'black' }]}></View>
        <View style={[styles.roundedView, { marginLeft: 4, marginRight: 4 }]}></View>
        <View style={styles.roundedView}></View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.btnButton1, styles.skipButton]}
          onPress={redirectCustomerLogin}
        >
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnButton2, { backgroundColor: 'black' }]}
          onPress={redirectSplashScreen2}
        >
          <Text style={{ color: '#FFC000' }}>Next</Text>
        </TouchableOpacity>
      </View>
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
  description: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 60,
  },

  roundedView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 15,
    width: 15,
    borderRadius: 10,
    marginTop: 60,
    marginBottom:10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  btnButton1: {
    borderRadius: 20,
    borderWidth: 1, // Border width
    borderColor: '#000000', // Border color
    padding: 13,
    width: '48%',
    height: 50,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnButton2: {
    borderRadius: 20,
    backgroundColor: '#FFC000', // Background color
    borderWidth: 1, // Border width
    borderColor: '#000000', // Border color
    padding: 13,
    width: '48%',
    height: 50,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default SplashScreen;
