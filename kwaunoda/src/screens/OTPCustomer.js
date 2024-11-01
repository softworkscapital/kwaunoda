import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    Text,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from "react-native";
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const OTPCustomer = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [registrationDetails, setRegistrationDetails] = useState(null);

    useEffect(() => {
        const fetchRegistrationDetails = async () => {
            const data = await AsyncStorage.getItem('registrationDetails');
            if (data) {
                const parsedData = JSON.parse(data);
                setRegistrationDetails(parsedData);
                console.log("Fetched Registration Details:", parsedData);
                generateAndSendOtp(parsedData.email);
            }
        };
        fetchRegistrationDetails();
    }, []);

    const generateAndSendOtp = async (email) => {
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(otpCode);
        console.log("Generated OTP:", otpCode);

        // Simulate sending OTP to email
        Toast.show({
            text1: "OTP Sent",
            text2: "Check your email for the OTP.",
            type: 'success',
            position: 'top',
        });
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString === generatedOtp) {
            setLoading(true);
            try {
                // Store registration details in AsyncStorage instead of posting to a database
                await AsyncStorage.setItem('customerDetails', JSON.stringify(registrationDetails));
                console.log("Customer details stored in Async Storage:", registrationDetails);
                
                Alert.alert("Success", "Registration completed successfully.");
                await AsyncStorage.removeItem('registrationDetails'); // Clear registration details
                // Navigate to the desired screen, e.g., CustomerLogin
            } catch (error) {
                console.error("Error during registration:", error);
                Alert.alert("Error", "An error occurred during registration. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("Error", "Invalid OTP. Please try again.");
        }
    };

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text.length === 1 && index < otp.length - 1) {
            this[`otpInput${index + 1}`].focus();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={40} color="red" />
                <Text style={styles.appName}>Kwaunoda</Text>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Enter OTP</Text>
            </View>
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(input) => { this[`otpInput${index}`] = input; }}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                    />
                ))}
            </View>
            <TouchableOpacity style={styles.btnVerify} onPress={handleVerifyOtp} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="black" />
                ) : (
                    <Text style={styles.txtVerify}>Verify OTP</Text>
                )}
            </TouchableOpacity>
            <Toast />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    topBar: {
        width: "100%",
        height: "25%",
        backgroundColor: "#FFC000",
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    appName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginLeft: 10,
    },
    titleContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: "90%",
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
    },
    btnVerify: {
        backgroundColor: "#FFC000",
        borderRadius: 50,
        padding: 14,
        width: "90%",
        alignItems: "center",
    },
    txtVerify: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default OTPCustomer;