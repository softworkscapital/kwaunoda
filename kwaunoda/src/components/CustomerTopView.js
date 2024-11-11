import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
    ScrollView,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons'; // Ensure you have this package installed
import defaultprofpic from "../../assets/defaultprofpic.webp";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { API_URL } from "../../src/screens/config"; // Ensure to import your API_URL

const { height } = Dimensions.get('window'); // Get device height

const CustomerTopView = ({ profileImage, notificationCount }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: "",
        surname: "",
        usertype: "",
        accountCategory: "",
    });

    const menuOptions = [
        { id: "0", title: "Standard Account", style: { color: userDetails.accountCategory === "Standard" ? "green" : "black", fontWeight: userDetails.accountCategory === "Standard" ? "bold" : "normal" } },
        { id: "1", title: "Profile Info", onPress: () => handleMenuPress("ProfileInformation") },
        { id: "9", title: "Wallet", onPress: () => handleMenuPress("Wallet") },
        { id: "7", title: "History", onPress: () => handleMenuPress("History") },
        { id: "8", title: "Settings", onPress: () => handleMenuPress("settings") },
        { id: "2", title: "FAQ", onPress: () => handleMenuPress("FAQ") },
        { id: "3", title: "Safety", onPress: () => handleMenuPress("Safety") },
        { id: "4", title: "Feedback", onPress: () => handleMenuPress("Feedback") },
        { id: "5", title: "About Us", onPress: () => handleMenuPress("AboutUs") },
        { id: "6", title: "Complaint", onPress: () => handleMenuPress("Complaint") },
    ];

    const handleMenuPress = (screen) => {
        setModalVisible(false); // Close the menu
        navigation.navigate(screen); // Navigate to the selected screen
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            const storedId = await AsyncStorage.getItem("theIds");
            const parsedId = JSON.parse(storedId);
            const customerid = parsedId?.customerid;

            try {
                if (customerid) {
                    const response = await fetch(
                        `${API_URL}/customerdetails/${customerid}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    const result = await response.json();
                    await AsyncStorage.setItem("userDetails", JSON.stringify(result[0]));

                    setUserDetails({
                        name: result[0].name || "",
                        surname: result[0].surname || "",
                        usertype: result[0].usertype || "",
                        accountCategory: result[0].account_category || "Standard", // Assuming a default value
                    });

                    // Fetch additional data if necessary
                    // e.g., fetchData(customerid);
                }
            } catch (error) {
                console.error("Error fetching user details: ", error);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image 
                    source={defaultprofpic} 
                    style={[styles.profileImage, {marginTop: 10}]} 
                />
                <View>
                    <Text style={{fontWeight: "800"}}>{userDetails.name} {userDetails.surname}</Text>
                    <Text style={styles.customerType}>{userDetails.usertype}</Text>
                </View>
            </View>
            <View style={styles.notificationContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <FontAwesome name="bell" size={24} color="black" />
                    {notificationCount > 0 && (
                        <View style={styles.notificationCount}>
                            <Text style={styles.countText}>{notificationCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.menuButton, { marginLeft: 25 }]}>
                    <FontAwesome name="bars" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <Modal 
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={[styles.modalContainer, { height: height * 0.9 }]}>
                        <ScrollView style={styles.scrollView}>
                            <FlatList
                                data={menuOptions}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.menuItem} 
                                        onPress={item.onPress}
                                    >
                                        <Text style={[styles.menuText, item.style]}>{item.title}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
        backgroundColor: "green", 
        paddingTop: 20,
        paddingRight: 30,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    customerType: {
        fontSize: 16,
        fontWeight: "bold",
    },
    notificationContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    notificationCount: {
        position: "absolute",
        right: -8, // Adjusted position
        top: -8, // Adjusted position
        backgroundColor: "red",
        borderRadius: 10,
        padding: 3, // Adjusted size
        minWidth: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    countText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
    menuButton: {
        marginLeft: 15,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: "90%",
        height: "100%",
        backgroundColor: "white", // Set background to white
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    scrollView: {
        width: "100%",
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    menuText: {
        fontSize: 16,
    },
    closeButton: {
        alignItems: "center",
        padding: 10,
        backgroundColor: "green",
        borderRadius: 5,
        marginTop: 10, // Space above close button
    },
    closeText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CustomerTopView;