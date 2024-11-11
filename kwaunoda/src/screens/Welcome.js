import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
} from "react-native";

const Welcome = ({ navigation }) => {
    const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for fade animation
    const [rotationAnim] = useState(new Animated.Value(0)); // Rotation animation

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Rotation animation
        Animated.loop(
            Animated.timing(rotationAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();

        // Start fading in
        fadeAnim.setValue(1);
    }, [fadeAnim, rotationAnim]);

    const handleBack = () => {
        navigation.navigate('CustomerLogin'); // Navigate to CustomerLogin.js
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.boxContainer}>
                <Animated.View 
                    style={[styles.box, { 
                        transform: [{ 
                            rotate: rotationAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) 
                        }] 
                    }]}>
                    <Text style={styles.boxText}>Kwaunoda</Text>
                </Animated.View>
            </View>
            <Text style={styles.message}>
                Your account is still being verified by the Kwaunoda agents. 
            </Text>
            <Text style={[styles.message, {marginTop: 10}]}>
               Please be patient...
            </Text>
            <TouchableOpacity style={styles.btnBack} onPress={handleBack}>
                <Text style={styles.txtBack}>Back</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    boxContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 200, // Height for centering
        width: "100%",
    },
    box: {
        width: 120, // Increased width
        height: 120, // Increased height
        backgroundColor: "green",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 80
    },
    boxText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16,
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 120,
    },
    btnBack: {
        backgroundColor: "green",
        borderRadius: 50,
        padding: 14,
        width: "100%",
        alignItems: "center",
        marginTop: 80,
        fontSize: 12
    },
    txtBack: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Welcome;