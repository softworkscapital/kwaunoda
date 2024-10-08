import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationArrow, faUser, faPhone, faIdCard, faMapMarker, faMapMarkerAlt, faBagShopping, faScaleBalanced, faArrowCircleLeft, faArrowCircleRight, faDollar, faTicket } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewDelivery = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [deliverynotes, setDeliverynotes] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [parcelDescription, setParcelDescription] = useState("");
    const [weight, setWeight] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [price, setPrice] = useState("");
    const [contact, setContact] = useState("");
    const [code, setCode] = useState("");
    const [cid, setCid] = useState("");

    const navigation = useNavigation();

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

    const APILINK = API_URL;
    const handleSubmit = () => {
        if (!parcelDescription || !weight || !from || !to || !price) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        console.log("Delivery details:", {
            parcelDescription,
            weight,
            from,
            to,
            paymentMethod,
            price,
        });
        Alert.alert("Success", "Delivery details submitted!");
    };

    const symbol = (code) => {
        if(code === "USD" || code === "ZIG"){
            setCid("$");
            setCode("USD");
        }else if( code === "ZAR"){
            setCid("R");
            setCode("ZAR");
        }else if( code === "BWP"){
            setCid("P");
            setCode("BWP");
        }
    }
    useEffect(() => {
        const checkProp = async () => {
            try {
                symbol(code);
            } catch (error) {
                console.log(error)
            }
        }
    
        checkProp();
      }, []);


    const handleSignUp = async () => {

       
        try {
            const User = await AsyncStorage.getItem('userDetails');
            const user = JSON.parse(User);
            const deliveryData = {
                driver_id: "", // Replace with actual driver ID
                cust_id: user.customerid,
                request_start_datetime: new Date() .toISOString(),
                order_start_datetime: "",
                order_end_datetime: "", // Current time as start time
                status: "Pending", // Set initial status
                deliveray_details: parcelDescription,
                delivery_notes: deliverynotes,
                weight: weight,
                delivery_contact_details: contact,
                dest_location: to,
                origin_location: from,
                origin_location_lat: "0",
                origin_location_long: "0", 
                destination_lat: "0",
                destination_long: "0", 
                distance: "0", 
                delivery_cost_proposed: price, 
                accepted_cost: "0",
                payment_type: paymentMethod,
                currency_id: cid,
                currency_code: code,
                customer_comment: "", 
                driver_comment: "", 
                driver_stars: "0", 
            };
    
             console.log(deliveryData);
             
            const response = await fetch(`${APILINK}/trip/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deliveryData),
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                Alert.alert("Success", result.message);
                navigation.goBack();
            } else {
                Alert.alert("Error", result.message || "Failed to submit delivery details.");
            }
        } catch (error) {
            console.error("Error posting delivery data:", error);
            Alert.alert("Error", "An error occurred while submitting your delivery details.");
        }
        
        

    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.viewTop}>
                    <Image
                        style={styles.profileImage}
                        source={require("../../assets/profile.jpeg")}
                    />
                    <View style={styles.nameContainer}>
                        <Text style={styles.txtName}>King Godo</Text>
                        <Text style={styles.txtName}>Customer</Text>
                    </View>
                    <TouchableOpacity style={styles.menuIcon} >
                        <FontAwesome5 name="bars" size={20} color="#595959" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ alignItems: 'center', marginTop: 10, bottom: 0 }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size={25} color="red" />
                <Text style={styles.appName}>Kwaunoda</Text>
            </View>
            <ScrollView>
                <View style={styles.formContainer}>
                    <View>
                        <Text style={{ alignSelf: 'center', fontSize: 14, marginBottom: 10 }}>New Delivery</Text>
                    </View>

                    <View style={styles.inputContainerAlt}>
                        <FontAwesomeIcon icon={faBagShopping} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Parcel Description"
                            value={parcelDescription}
                            onChangeText={setParcelDescription}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faScaleBalanced} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Weight (kg)"
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faArrowCircleLeft} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="From (1 Somewhere Surbub, Harare)"
                            value={from}
                            onChangeText={setFrom}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faArrowCircleRight} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="To (0000 Somewhere Suburb, Harare)"
                            value={to}
                            onChangeText={setTo}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <FontAwesomeIcon icon={faPhone} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Delivery Contact (263123456789)"
                            value={contact}
                            onChangeText={setContact}
                        />
                    </View>
                    <View style={styles.inputContainer2}>
                        <FontAwesomeIcon icon={faBagShopping} size={12} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Delivery Notes"
                            value={deliverynotes}
                            onChangeText={setDeliverynotes}
                        />
                    </View>

                    <View style={styles.pickerContainer}>
                        <Picker
                            // selectedValue={paymentMethod}
                            style={[styles.picker, { fontSize: 10, color: '#666' }]}
                            // onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                        >
                            <Picker.Item label="Paying When" value="Paying When" />
                            <Picker.Item label="Pay Before Delivery" value="Pay Before Delivery" />
                            <Picker.Item label="Pay After Delivery" value="Pay After Delivery" />
                        </Picker>
                    </View>

                    <View style={[styles.pickerContainer, { borderWidth: 1, borderColor: '#ccc', borderRadius: 4 }]}>
                        <Picker
                            selectedValue={paymentMethod}
                            style={[styles.picker, { fontSize: 10, color: '#666' }]}
                            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                        >
                            <Picker.Item label="Paying With" value="Paying With" />
                            <Picker.Item label="Paying With Cash" value="Cash" />
                            <Picker.Item label="Paying With Bank" value="Bank" />
                            <Picker.Item label="Paying With Zipit" value="Zipit" />
                            <Picker.Item label="Paying With Ecocash" value="Ecocash" />
                            <Picker.Item label="Paying With Innbuks" value="Innbuks" />
                        </Picker>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.inputContainer, { width: '55%' }]}>
                            <Text>{cid} </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Proposed Price"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={[styles.pickerContainer, { width: '45%', marginLeft: 2 }]}>
                            <Picker
                                style={[styles.picker, { fontSize: 10, color: '#666' }]}
                                onValueChange={(itemValue) => {const cod = itemValue; symbol(cod); setCode(itemValue)}}
                            >
                                <Picker.Item label="CURRENCY" value=""/>
                                <Picker.Item label="USD" value="USD"/>
                                <Picker.Item label="ZIG" value="ZIG" />
                                <Picker.Item label="RAND" value="ZAR" />
                                <Picker.Item label="PULA" value="BWP" />
                            </Picker>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.btnSignUp} onPress={handleSignUp}>
                        <Text style={styles.txtSignUp}>OK</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    topBar: {
        height: "14%",
        backgroundColor: "#FFC000",
        justifyContent: "center",
        marginBottom: 20,
    },
    viewTop: {
        height: 60,
        backgroundColor: '#FFC000',
        flexDirection: "row",
        width: "100%",
        marginTop: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "space-between",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
    },
    nameContainer: {
        flexDirection: "column",
        flex: 1,
    },
    txtName: {
        fontSize: 11,
        color: "#595959",
        fontWeight: "bold",
    },
    surname: {
        fontSize: 13,
        color: "#595959",
        fontWeight: "bold",
    },
    menuIcon: {
        padding: 10,
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
    inputContainerAlt: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: "10%",
        padding: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    inputContainer2: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: "10%",
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
        color:"#cc",
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 10,
    }
});

export default NewDelivery;