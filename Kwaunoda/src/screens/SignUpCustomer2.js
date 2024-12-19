import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const CustomerSignUp2 = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const navigation = useNavigation();

    const validateInput = () => {
        if (!email || !password || !confirmPassword) {
            Toast.show({
                text1: "Validation Error",
                text2: "Please fill all fields.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.show({
                text1: "Validation Error",
                text2: "Please enter a valid email address.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        if (password.length < 8) {
            Toast.show({
                text1: "Validation Error",
                text2: "Password must be at least 8 characters long.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        if (password !== confirmPassword) {
            Toast.show({
                text1: "Validation Error",
                text2: "Passwords do not match.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        return true;
    };

    const checkPasswordStrength = (password) => {
        let strength = 0;
        const regexWeak = /[a-z]/;
        const regexMedium = /[A-Z]/;
        const regexStrong = /\d/;

        if (regexWeak.test(password)) strength++;
        if (regexMedium.test(password)) strength++;
        if (regexStrong.test(password)) strength++;
        if (password.length >= 12) strength++;

        setPasswordStrength(strength);
        setPasswordMatch(password === confirmPassword);
    };

    const handleNext = async () => {
        if (!validateInput()) return;

        setLoading(true);

        const user = { email, password };

        try {
            await AsyncStorage.setItem('userDetailsC2', JSON.stringify(user));
            console.log("User details stored in Async Storage:", user);

            navigation.navigate("SignUpCustomer3");
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Failed to save details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={40} color="red" />
                <Text style={styles.appName}>Kwaunoda</Text>
            </View>
            <ScrollView>
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                checkPasswordStrength(text);
                            }}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setPasswordMatch(text === password);
                            }}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.strengthContainer}>
                        <View style={[styles.strengthBar, passwordStrength >= 1 && styles.weak]} />
                        <View style={[styles.strengthBar, passwordStrength >= 2 && styles.medium]} />
                        <View style={[styles.strengthBar, passwordStrength >= 3 && styles.strong]} />
                    </View>
                    <Text style={styles.strengthText}>
                        {passwordStrength === 0 ? "" : passwordStrength === 1 ? "Weak" : passwordStrength === 2 ? "Medium" : "Strong"}
                    </Text>
                    {!passwordMatch && <Text style={styles.errorText}>Passwords do not match.</Text>}

                    <TouchableOpacity style={styles.btnNext} onPress={handleNext} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <Text style={styles.txtNext}>Next</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast /> 
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    topBar: {
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
    formContainer: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        paddingHorizontal: 10,
    },
    input: {
        height: 40,
        padding: 10,
    },
    strengthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    strengthBar: {
        flex: 1,
        height: 10,
        marginHorizontal: 2,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
    },
    weak: {
        backgroundColor: "red",
    },
    medium: {
        backgroundColor: "orange",
    },
    strong: {
        backgroundColor: "green",
    },
    strengthText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    errorText: {
        color: 'red',
        alignSelf: 'center',
        marginBottom: 10,
    },
    btnNext: {
        backgroundColor: "green",
        borderRadius: 50,
        padding: 14,
        width: "100%",
        alignItems: "center",
    },
    txtNext: {
        color: "black",
        fontSize: 13,
        fontWeight: "bold",
    },
});

export default CustomerSignUp2;