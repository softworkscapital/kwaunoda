import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL} from "./config";


const categories = [
    "Automotive",
    "Baby & Childcare",
    "Baby Products",
    "Bakery",
    "Beverages",
    "Books & Stationery",
    "Cleaning and Detergents",
    "Clothing & Accessories",
    "Computers and Accessories",
    "Condiments & Spices",
    "Dairy",
    "Fresh Produce",
    "Frozen Foods",
    "Health & Beauty",
    "Health Foods",
    "Home & Living",
    "Jewelry & Accessories",
    "Kitchenware",
    "Meat & Seafood",
    "Music & Instruments",
    "Pantry Staples",
    "Pet Supplies",
    "Snacks",
    "Sports & Outdoors",
    "Stationery and Office Equipment",
    "Toys & Games",
    "Travel & Luggage",
    "Collectibles"
];

const CustomCheckbox = ({ label, isChecked, onChange }) => {
    return (
        <TouchableOpacity style={styles.checkboxContainer} onPress={onChange}>
            <View style={[styles.checkbox, isChecked && styles.checked]} />
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const OnlineStore = () => {
    const [selectedCategories, setSelectedCategories] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleCheckboxChange = (category) => {
        setSelectedCategories(prevState => ({
            ...prevState,
            [category]: !prevState[category],
        }));
    };

    const handleSubmit = () => {
        const selected = Object.keys(selectedCategories).filter(key => selectedCategories[key]);
        if (selected.length > 0) {
            setModalVisible(true);
        } else {
            Alert.alert('No Selection', 'Please select at least one category.');
        }
    };

    const confirmSelection = async () => {
        const selected = Object.keys(selectedCategories).filter(key => selectedCategories[key]);
        console.log('Selected Categories:', selected);
        try {
            await AsyncStorage.setItem("SelectedCategories", JSON.stringify(selected));
            navigation.navigate('StoreCategories'); // Navigate to the next page
            setModalVisible(false);
            Alert.alert('Preferences Saved', 'Your preferences have been saved successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save preferences. Please try again.');
        }
    };

    const redirectHome = () => {
        navigation.goBack();
      };


  useFocusEffect(
    useCallback(() => {
      const fetchUserIdAndCallLastActivity = async () => {
        const storedIds = await AsyncStorage.getItem("theIds");
        const parsedIds = JSON.parse(storedIds);
        if (parsedIds && parsedIds.customerId === "0") {
          lastActivity(parsedIds.customerId);
        }else{
            lastActivity(parsedIds.driver_id); 
        }
      };

      fetchUserIdAndCallLastActivity();
    }, [])
  );

  const lastActivity = async (id) => {
    console.log("user last activity logged", id);
    try {
      const response = await fetch(
        `${API_URL}/users/update_last_activity_date_time/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error Response:", errorResponse);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("last loggy:", result);
    } catch (error) {
      console.log(error);
    }
  };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                        <TouchableOpacity style={styles.backArrow} onPress={redirectHome}>
                          <MaterialIcons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                <Text style={styles.title}>Select Your Preferences</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {categories.map((category) => (
                    <CustomCheckbox
                        key={category}
                        label={category}
                        isChecked={!!selectedCategories[category]}
                        onChange={() => handleCheckboxChange(category)}
                    />
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Confirm your selection:</Text>
                    <Text>{Object.keys(selectedCategories).filter(key => selectedCategories[key]).join(', ')}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmSelection}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText2}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    header: {
        backgroundColor: "#ffc000",
        paddingVertical: 30,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
      },
      backArrow: {
        padding: 8,
        marginTop: 14,
      },
    title: {
        fontSize: 20,
        color: "#000",
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    scrollContainer: {
        paddingBottom: 20,
        paddingHorizontal: 30,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        marginRight: 10,
    },
    checked: {
        backgroundColor: '#ffc000',
    },
    label: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: "#FFC000",
        borderRadius: 50,
        padding: 14,
        width: "97%",
        alignItems: "center",
        marginTop: 50,
        marginBottom: 35,
        marginHorizontal:10,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonText2: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalView: {
        marginTop: 350,
        margin: 20,
        width: "90%",
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalButtons: {
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 50,
        margin: 6,
        alignItems: 'center',
        width: '45%',
    },
    confirmButton: {
        backgroundColor: '#ffc000',
    },
    cancelButton: {
        backgroundColor: '#000',

    },
});

export default OnlineStore;