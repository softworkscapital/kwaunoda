import React, { useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from './config'; // Adjust the path as necessary

const OTPCustomer = ({ navigation }) => {
    const route = useRoute(); // Access route parameters
    const { userId } = route.params; // Destructure userId from route parameters
  
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(true);
    const [fetchedOtp, setFetchedOtp] = useState("");

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        setLoading(true);
        try {
            // Fetch user details using the hardcoded user ID
            const response = await fetch(`${API_URL}/USERS/${userId}`);
            const userDetails = await response.json();
            console.log("Fetched User Details:", userDetails);

            if (userDetails && userDetails.length > 0) {
                const fetchedOtp = userDetails[0].otp.toString(); // Assuming OTP is in user details
                console.log("Fetched OTP from database:", fetchedOtp); // Log the fetched OTP
                if (otpString === fetchedOtp) {
                    Alert.alert("Success", "OTP verified successfully.");
                    navigation.navigate('CustomerLogin'); // Navigate to CustomerLogin.js
                } else {
                    Alert.alert("Error", "Invalid OTP. Please try again.");
                }
            } else {
                Alert.alert("Error", "User details not found.");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            Alert.alert("Error", "An error occurred while verifying OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        // Automatically focus on the next input if the current one is filled
        if (text.length === 1 && index < otp.length - 1) {
            this[`otpInput${index + 1}`].focus();
        }
    };

    const handleResendOtp = () => {
        // Optionally, resend OTP logic can be implemented here
        Alert.alert("Info", "Resend OTP functionality not implemented yet.");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={40} color="red" />
                <Text style={styles.appName}>EasyGo</Text>
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

            <TouchableOpacity onPress={handleResendOtp} style={styles.resendContainer}>
                <Text style={styles.txtResend}>Resend OTP</Text>
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
        backgroundColor: "green",
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
        backgroundColor: "green",
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
    resendContainer: {
        marginTop: 20,
    },
    txtResend: {
        color: "#007BFF", // Change color to blue to indicate it's clickable
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default OTPCustomer;