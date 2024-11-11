import React, { useState } from "react";
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
import defaultprofpic from "../../assets/defaultprofpic.webp"

const { height } = Dimensions.get('window'); // Get device height

const TopView = ({ profileImage, customerType, notificationCount }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const menuOptions = [
        { id: "0", title: "Standard Account", onPress: () => handleMenuPress("StandardAccount"), color: "blue" },
        { id: "1", title: "Profile Info", onPress: () => handleMenuPress("ProfileInformation") },
        { id: "9", title: "Wallet", onPress: () => handleMenuPress("Wallet") },
        { id: "7", title: "History", onPress: () => handleMenuPress("History") },
        { id: "8", title: "Settings", onPress: () => handleMenuPress("settings") },
        { id: "2", title: "FAQ", onPress: () => handleMenuPress("FAQ") },
        { id: "3", title: "Safety", onPress: () => handleMenuPress("Safety") },
        { id: "10", title: "Chat", onPress: () => handleMenuPress("CustomerAdminChat") },
        { id: "4", title: "Feedback", onPress: () => handleMenuPress("Feedback") },
        { id: "5", title: "About Us", onPress: () => handleMenuPress("AboutUs") },
        { id: "6", title: "Complaint", onPress: () => handleMenuPress("Complaint") },
        { id: "11", title: "Tell A Friend", onPress: () => handleMenuPress("Invite") },
    ];

    const handleMenuPress = (screen) => {
        setModalVisible(false); // Close the menu
        navigation.navigate(screen); // Navigate to the selected screen
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image 
                    source={defaultprofpic} 
                    style={[styles.profileImage, {marginTop: 10}]} 
                />
                <View>
                    <Text style={{fontWeight: "800"}}>James Chibwe</Text>
                    <Text>Driver</Text>
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
                    <View style={[styles.modalContainer, { height: height * 0.9}]}>
                        <ScrollView style={styles.scrollView}>
                            <FlatList
                                data={menuOptions}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.menuItem} 
                                        onPress={item.onPress}
                                    >
                                        <Text style={styles.menuText}>{item.title}</Text>
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
        paddingTop: 30,
        paddingRight: 30,
        width: "100%"
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
        top: "fixed",
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

export default TopView;