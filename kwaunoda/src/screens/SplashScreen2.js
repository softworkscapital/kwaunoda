import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import SplashScreen3 from './SplashScreen3';


const SplashScreen2 = () => {
    const navigation = useNavigation();

    const bikeAnimation = useRef(new Animated.Value(-200)).current; // Start position above the screen

    useEffect(() => {
        Animated.timing(bikeAnimation, {
            topValue: 0, // End position at the desired location
            duration: 500, // Duration of the animation
            useNativeDriver: true,
        }).start();
    }, []);

    const redirectSplashScreen3 = () => {
        navigation.navigate("SplashScreen3");
    };

    const redirectCustomerLogin = () => {
        navigation.navigate("SplashScreen");
    };


    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ translateX: bikeAnimation }] }}>
            <Image style={{ height: 200, width: 200, marginTop: 40 }} source={require('../thumbnails/box.png')} />
            </Animated.View>

            <Text style={styles.description}>
                From small parcels to large orders, Kwaunoda delivers it all with care and efficiency.
            </Text>

            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.roundedView, {}]}></View>
                <View style={[styles.roundedView, { marginLeft: 4, marginRight: 4, backgroundColor: 'black' }]}></View>
                <View style={styles.roundedView}></View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.btnButton1, styles.skipButton]}
                    onPress={redirectCustomerLogin}
                >
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btnButton2, { backgroundColor: 'black' }]}
                    onPress={redirectSplashScreen3}
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
        backgroundColor: '#FFC000', // Gold background color
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    description: {
        fontSize: 18,
        color: '#000', // Black text color
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 60,
    },

    roundedView: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 15,
        width: 15,
        borderRadius: 10
    },


    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 30
    },
    button: {
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
        alignItems: 'center',
        flex: 1,
    },

    btnButton1: {
        borderRadius: 20,
        borderWidth: 1, // Border width
        borderColor: '#000000', // Border color
        padding: 13,
        width: "48%",
        height: 50,
        alignItems: "center",
        alignSelf: 'center',
        justifyContent: "center",
        marginTop: 20,
    },

    btnButton2: {
        borderRadius: 20,
        backgroundColor: "#FFC000", // Background color
        borderWidth: 1, // Border width
        borderColor: '#000000', // Border color
        padding: 13,
        width: "48%",
        height: 50,
        alignItems: "center",
        alignSelf: 'center',
        justifyContent: "center",
        marginTop: 20,
    },

});

export default SplashScreen2;
