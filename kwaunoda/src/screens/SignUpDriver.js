import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    Alert
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faPhone, faIdCard, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

const SignUpDriver = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [plate, setPlate] = useState("");
    const [idnumber, setIdnumber] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const validateInput = () => {
        if (!name || !surname || !phone || !idnumber || !plate || !profilePic) {
            Toast.show({
                text1: "Validation Error",
                text2: "Please fill all fields and upload a profile picture.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        if (!/^\d+$/.test(phone)) {
            Toast.show({
                text1: "Validation Error",
                text2: "Phone number should contain only digits.",
                type: 'error',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
            return false;
        }

        return true;
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
        }
    };

    const handleSignUp = async () => {
        if (!validateInput()) return;

        setLoading(true);

        const driverDetails = { name, surname, phone, idnumber, plate };

        try {
            await AsyncStorage.setItem('driverDetailsD0', JSON.stringify(driverDetails));
            console.log("Driver details stored in Async Storage:", driverDetails);

            navigation.navigate("SignUpDriver1");
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Failed to sign up. Please try again.");
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
                    <View>
                        <Text style={{ alignSelf: 'center', fontSize: 14, marginBottom: 10 }}>Sign Up As Driver</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faUser} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faUser} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Surname"
                            value={surname}
                            onChangeText={setSurname}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faPhone} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faIdCard} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="ID No."
                            value={idnumber}
                            onChangeText={setIdnumber}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faIdCard} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Number Plate"
                            value={plate}
                            onChangeText={setPlate}
                        />
                    </View>

                    <TouchableOpacity style={styles.picButton} onPress={pickImage}>
                        <Text style={styles.picButtonText}>
                            {profilePic ? "Change Profile Picture" : "Upload Profile Picture"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.central}>
                        {profilePic && (
                            <Image source={{ uri: profilePic }} style={styles.profileImage} />
                        )}
                    </View>

                    <TouchableOpacity style={styles.btnSignUp} onPress={handleSignUp}>
                        <Text style={styles.txtSignUp}>Next</Text>
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
        backgroundColor: "#FFC000",
        borderBottomLeftRadius: 45,
        borderBottomRightRadius: 45,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5,
    },
    appName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginLeft: 10,
    },
    formContainer: {
        padding: 20,
        justifyContent: "space-between",
        flexDirection: 'column',
        height: '100%',
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    icon: {
        marginRight: 15,
        marginLeft: 10
    },
    input: {
        flex: 1,
    },
    btnSignUp: {
        backgroundColor: "#FFC000",
        borderRadius: 50,
        padding: 14,
        width: "100%",
        alignItems: "center",
    },
    txtSignUp: {
        color: "black",
        fontSize: 13,
        fontWeight: "bold",
    },
    picButton: {
        backgroundColor: "#FFC00040",
        borderRadius: 50,
        padding: 14,
        width: "100%",
        alignItems: "center",
        marginBottom: 15,
    },
    picButtonText: {
        color: "black",
        fontSize: 13,
        fontWeight: "bold",
    },
    profileImage: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    central: {
        alignItems: "center",
    },
});

export default SignUpDriver;