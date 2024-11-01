import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image,Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomFooter2 from './BottomFooter2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';
import Toast from 'react-native-toast-message';

const DeliveryAccepted = () => {
    const [tripDetails, setTripDetails] = useState(true);
    const navigation = useNavigation();  
    const APILINK = API_URL;
    const [results, setResults] = useState();
    const [status, setStatus] = useState();
    const [notes, setNotes] = useState();
    const [driver, setDriver] = useState();
    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [surname, setSurname] = useState();
    const [details, setDetails] = useState();
    const [tripId, setTripId] = useState();
    const [destination, setDestination] = useState();

    const redirectHome = () => {
        navigation.goBack();
    }

    const redirectFeedback = () => {
        navigation.navigate("CustomerFeedback");
    } 

    const confirm = async() => {
        if(status === "Arrived At Destination"){
            const updatedStatus = "Waiting Driver Rating"
            //json
            const data = {
                status: updatedStatus,
            }

            try {
                const response = await fetch(`${API_URL}/trip/customerComment/${tripId}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });
          
                const result = await response.json();
                
          
                if (response.ok) {
                  Alert.alert("Success", result.message);
                  redirectFeedback();
                } else {
                  Alert.alert("Error", result.message || "Failed to submit feedback.");
                }
              } catch (error) {
                console.error("Error posting feedback:", error);
                Alert.alert("Error", "An error occurred while submitting your feedback.");
              }
        } else{
            Toast.show({
                text1: "CAUTION",
                text2: "Driver Has Not Arrived Yet.",
                type: 'info',
                position: 'center',
                visibilityTime: 3000,
                autoHide: true,
            });
        }
        
    }
        
    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const tripData = await AsyncStorage.getItem('tripDetails'); 
                const parsedTripData = JSON.parse(tripData);
                if(parsedTripData === null){
                    setTripDetails(!tripDetails);
                }

                console.log(parsedTripData);
                setStatus(parsedTripData.status);
                setNotes(parsedTripData.delivery_notes);
                setDetails(parsedTripData.deliveray_details);
                setDestination(parsedTripData.dest_location);
                setTripId(parsedTripData.trip_id)
                const driver_id = parsedTripData.driver_id;

                console.log(driver_id)
                const resp = await fetch(`${APILINK}/driver/${driver_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const res = await resp.json();
                console.log(res);
                setDriver(res[0]);
                setName(res[0].name);
                setSurname(res[0].surname);
                setUsername(res[0].username);
                
            } catch (error) {
                console.error('Error fetching trip details:', error);
            }
        };
        fetchTripDetails();
    }, []);

    if (!tripDetails) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
        <View style={[styles.topBar, { paddingTop: 35, backgroundColor: '#FFC000', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <TouchableOpacity style={[styles.backArrow]} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <View style={styles.topBarContent}>
                    <Text style={[styles.title, { color: '#000', }]}>{status}</Text>
                </View>

                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
                    {/* Add your edit button content here */}
                </TouchableOpacity>
            </View>
            
        <ScrollView style={{ backgroundColor: 'white', paddingHorizontal: 15,paddingBottom: 10 }}>


            <View style={[styles.Scontainer, styles.bgWhite]}>
                <View style={[styles.profileContainer]}>
                    <Image
                        style={[styles.profilePicture, { alignSelf: 'flex-start', marginRight: 10 }]}
                        source={require("../../assets/profile.jpeg")}
                    />
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Your Driver</Text>
                        <Text style={styles.username}>{name} {surname} ({username})</Text>
                    </View>
                </View>

                <View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green', marginBottom: 5}}>
                        Your parcel is on the way
                    </Text>

                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 7, marginTop: 1 }}>Delivery details</Text>
                    <Text style={{ marginBottom: 2}}>
                        {details}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 11, marginBottom: 7}}>Notes</Text>
                    <Text style={{marginBottom: 10,}}>
                        {notes || "no notes"}
                    </Text>

                    <View style={{ flexDirection: 'row', marginBottom: 7, alignContent: 'center'}}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Destination:</Text>
                    </View>
                    <Text style={{ paddingBottom: 10,}}>{destination}</Text>
                </View>

                <TouchableOpacity style={[styles.submitButton, styles.textWhite, { backgroundColor: '#FFC000', marginTop: 40, marginBottom: 10 }]} onPress={confirm}>
                    <Text style={styles.submitButtonText}>End Trip</Text>
                </TouchableOpacity>

{/* 
                <TouchableOpacity style={[styles.submitButton, styles.textWhite, { backgroundColor: '#FFC000', marginTop: 40, marginBottom: 10 }]} onPress={redirectHome}>
                    <Text style={styles.submitButtonText}>Close</Text>
                </TouchableOpacity> */}
            </View>
        </ScrollView>
        
        <BottomFooter2/>
        
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    Scontainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backArrow: {
        padding: 8,
    },
    topBarContent: {
        flex: 1,
        alignItems: 'center',
    },
    bgWhite: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    fontBold: {
        fontWeight: 'bold',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
    },
    textWhite: {
        color: '#fff',
    },
    submitButtonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    textArea: {
        width: '80%',
        height: 80,
        padding: 10,
        borderWidth: 0,
        borderColor: '#000',
        fontSize: 16,
        textAlignVertical: 'top',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
    },
    bottomBarItem: {
        alignItems: 'center',
    },
    bottomBarText: {
        fontSize: 14,
        marginTop: 4,
    },
});

export default DeliveryAccepted;