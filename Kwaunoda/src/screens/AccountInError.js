import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountInError = () => {
    const navigation = useNavigation();
    const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for fade animation
    const [accountStatus, setAccountStatus] = useState("");

    useEffect(() => {
        // Fetch user status from AsyncStorage
        const fetchAccountStatus = async () => {
            const status = await AsyncStorage.getItem("userStatus");
            if (status) {
                setAccountStatus(status);
            }
        };

        fetchAccountStatus();

        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleBack = () => {
        navigation.navigate('CustomerLogin'); // Navigate to CustomerLogin.js
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Text style={[styles.message,{marginTop:190}]}>
                Account <Text style={styles.status}>{accountStatus}</Text>. Please contact our client support services at +263777777777
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.btnBack, {marginTop: 150}]} onPress={handleBack}>
                    <Text style={styles.txtBack}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnChat} onPress={handleBack}>
                    <Text style={styles.txtChat}>Chat Now</Text>
                </TouchableOpacity>
            </View>
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
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20,
    },
    status: {
        color: "red", // Changed color for the status text
        fontWeight: "bold",
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
    btnBack: {
        backgroundColor: "#FFC000",
        borderRadius: 50,
        padding: 14,
        width: "80%",
        alignItems: "center",
        marginVertical: 10,
    },
    btnChat: {
        backgroundColor: "white", // White background for Chat Now button
        borderColor: "#FFC000", // Golden yellow border
        borderWidth: 2, // Border width
        borderRadius: 50,
        padding: 14,
        width: "80%",
        alignItems: "center",
        marginVertical: 10,
    },
    txtBack: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
    },
    txtChat: {
        color: "#FFC000", // Golden yellow text for Chat Now button
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AccountInError;