import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const PaymentSuccessful = ({ navigation }) => {
  const scaleValue = new Animated.Value(1);

  // Function to animate the tick icon
  const startAnimation = () => {
    scaleValue.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleOkPress = () => {
    Alert.alert("Thank you!", "Your payment was successful.");
    navigation.goBack();
  };

  React.useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <FontAwesome name="check-circle" size={100} color="green" />
      </Animated.View>
      <Text style={styles.successMessage}>Payment Successful</Text>
      <TouchableOpacity style={styles.button} onPress={handleOkPress}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  successMessage: {
    fontSize: 24,
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FCC000', 
    padding: 15,
    borderRadius: 50, 
    width: '80%', 
    position: 'absolute',
    bottom: 35,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000', // Black text color
    fontSize: 18,
  },
});

export default PaymentSuccessful;