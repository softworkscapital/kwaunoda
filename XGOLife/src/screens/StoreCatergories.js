import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Button,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_STORE } from "./config";

// Sample categories data


const StoreCategories = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    getCatergories();
  }, []);
  
  const getCatergories = async () => {
    try {
      setLoading(true); // Show loading indicator
  
      const resp = await fetch(
        `${API_URL_STORE}/productdefinition/get_online_all_full_product_definitions`
      );
  
      const result = await resp.json();
      console.log("all Pdz", result);
  
      const uniqueCategories = new Set(result.map((product) => product.category));
      const categoriesArray = Array.from(uniqueCategories);
      console.log("Unique Categories:", categoriesArray);
  
      setCategories(categoriesArray);
  
      setTimeout(() => {
        setLoading(false); // Hide loading indicator
        navigation.navigate("StoreInventory", { selectedCategory: categoriesArray });
      }, 500);
  
    } catch (error) {
      console.log(error);
      setLoading(false); // Hide loading indicator in case of error
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ fontSize: 30, fontWeight: "bold", margin: 5 }}>
          Welcome to Xgo Store
        </Text>
        <Text style={{ fontSize: 20 }}>Happy Shopping</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffc000",
  },
  header: {
    backgroundColor: "#ffc000",
    paddingVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingLeft: 20,
  },
  headerText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    // marginTop: 300,
  },

  categoryContainer: {
    flex: 1,
    margin: 30,
    marginHorizontal: 40,
  },
  card: {
    borderRadius: 10,
    backgroundColor: "#eed111",
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  image: {
    width: 0,
    height: 1,
    borderRadius: 5,
    marginBottom: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cartButton: {
    paddingRight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default StoreCategories;
