import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

const BottomFooter2 = () => {
    const navigation = useNavigation();
    const [notificationModalVisible, setNotificationModalVisible] = useState(false);
    const [type, setType] = useState("");
    const [custid, setCustid] = useState("");
    const redirectHome = () => {
        navigation.goBack();
    };
    const [menuRequests, setMenuRequests] = useState([]);
    const APILINK = API_URL;

    const [notificationCount, setNotificationCount] = useState(0);

    const toggleNotificationModal = () => {
        setNotificationModalVisible(!notificationModalVisible);
        if (!notificationModalVisible) {
            setNotificationCount(0); // Reset count when modal is opened
        }
    };

    const redirectSettings = () => {
        navigation.navigate("settings"); // Ensure the route name is correct
    };

    const getData = async () => {
        try {
            const data = await AsyncStorage.getItem('userDetails');
            const parsedData = JSON.parse(data);
            setType(parsedData.usertype);
            const custid = parsedData.customerid;
            fetchData(custid);
        } catch (error) {
            console.error('Error fetching data from AsyncStorage:', error);
        }
        
    };

    const fetchData = async (custid) => {
        try {
            console.log(`${APILINK}/trip/customer/notify/${custid}`);
            const response = await fetch(`${APILINK}/trip/customer/notify/${custid}`);
            
            if (!response.ok) {
                const errorText = await response.text(); 
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
    
            // Store the fetched data in AsyncStorage
            await AsyncStorage.setItem('tripStatus', JSON.stringify(data));
    
            const requests = data.map(item => ({
                id: item.trip_id.toString(),
                title: `Trip ID: ${item.trip_id} - Delivery: ${item.deliveray_details}`,
                onPress: () => redirectToNotice(item.trip_id),
            }));
    
            setNotificationCount(prevCount => prevCount + 1);
            setMenuRequests(requests);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const redirectToNotice = async (tripId) => {
        try {
            const tripData = await AsyncStorage.getItem('tripStatus');
            const parsedTripData = JSON.parse(tripData);
            const tripDetails = parsedTripData.find(item => item.trip_id === tripId);
            console.log(tripDetails);
        
            await AsyncStorage.setItem('tripDetails', JSON.stringify(tripDetails));
            navigation.navigate("DeliveryAccepted", { tripDetails });
        } catch (error) {
            console.error('Error fetching trip data:', error);
        }
    
    };

    useEffect(() => {
        getData();
    }, []);


    return (
        <>
             {/* Notifications Modal */}
             <Modal
                    animationType="slide"
                    transparent={true}
                    visible={notificationModalVisible}
                    onRequestClose={toggleNotificationModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <FlatList
                                data={menuRequests}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.menuOption}
                                        onPress={item.onPress}
                                    >
                                        <Text style={styles.menuText}>{item.title}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity style={styles.closeButton} onPress={toggleNotificationModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            <View style={[styles.bottomBar, styles.goldenYellow]}>
                <TouchableOpacity style={styles.bottomBarItem} onPress={redirectHome}>
                    <MaterialIcons name="home" size={24} color="#000" />
                    <Text style={[styles.bottomBarText, { color: '#000' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem} onPress={toggleNotificationModal}>
                    <MaterialIcons name="notifications" size={24} color="#000" />
                    <Text style={[styles.bottomBarText, { color: '#000' }]}>Notifications</Text>
                    {notificationCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.badgeText}>{notificationCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem} onPress={redirectSettings}>
                    <MaterialIcons name="settings" size={24} color="#000" />
                    <Text style={[styles.bottomBarText, { color: '#000' }]}>Settings</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    goldenYellow: {
        backgroundColor: '#FFD700',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        backgroundColor: '#FFD700',
    },
    bottomBarItem: {
        alignItems: 'center',
    },
    bottomBarText: {
        fontSize: 14,
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    menuOption: {
        padding: 10,
    },
    menuText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FFD700',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#000',
    },
    notificationBadge: {
        position: 'absolute',
        right: 0,
        top: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 6,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
    },
});

export default BottomFooter2;