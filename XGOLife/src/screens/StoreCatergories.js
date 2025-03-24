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
const categoriesData = {
  1: [
    {
      id: 1,
      name: "Pharmacy",
      image:
        "https://images.pexels.com/photos/7230326/pexels-photo-7230326.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 2,
      name: "Restaurants",
      image:
        "https://images.pexels.com/photos/2530386/pexels-photo-2530386.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    { id: 3, name: "Automotive", image: "https://via.placeholder.com/100" },
    {
      id: 4,
      name: "Baby & Childcare",
      image: "https://via.placeholder.com/100",
    },
    { id: 5, name: "Baby Products", image: "https://via.placeholder.com/100" },
    { id: 6, name: "Bakery", image: "https://via.placeholder.com/100" },
    { id: 7, name: "Beverages", image: "https://via.placeholder.com/100" },
    {
      id: 8,
      name: "Books & Stationery",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 9,
      name: "Cleaning and Detergents",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 10,
      name: "Clothing & Accessories",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 11,
      name: "Computers and Accessories",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 12,
      name: "Condiments & Spices",
      image: "https://via.placeholder.com/100",
    },
    { id: 13, name: "Dairy", image: "https://via.placeholder.com/100" },
    { id: 14, name: "Fresh Produce", image: "https://via.placeholder.com/100" },
    { id: 15, name: "Frozen Foods", image: "https://via.placeholder.com/100" },
    {
      id: 16,
      name: "Health & Beauty",
      image: "https://via.placeholder.com/100",
    },
    { id: 17, name: "Health Foods", image: "https://via.placeholder.com/100" },
    { id: 18, name: "Home & Living", image: "https://via.placeholder.com/100" },
    {
      id: 19,
      name: "Jewelry & Accessories",
      image: "https://via.placeholder.com/100",
    },
    { id: 20, name: "Kitchenware", image: "https://via.placeholder.com/100" },
    {
      id: 21,
      name: "Meat & Seafood",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 22,
      name: "Music & Instruments",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 23,
      name: "Pantry Staples",
      image: "https://via.placeholder.com/100",
    },
    { id: 24, name: "Pet Supplies", image: "https://via.placeholder.com/100" },
    { id: 25, name: "Snacks", image: "https://via.placeholder.com/100" },
    {
      id: 26,
      name: "Sports & Outdoors",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 27,
      name: "Stationery and Office Equipment",
      image: "https://via.placeholder.com/100",
    },
    { id: 28, name: "Toys & Games", image: "https://via.placeholder.com/100" },
    {
      id: 29,
      name: "Travel & Luggage",
      image: "https://via.placeholder.com/100",
    },
    { id: 30, name: "Collectibles", image: "https://via.placeholder.com/100" },
  ],
};

const StoreCategories = () => {
  const navigation = useNavigation();
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orderedCategories, setOrderedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {

  //   orderLayout();
  // }, []);

  // const orderLayout = async () => {
  //   try {
  //     const result = await AsyncStorage.getItem("SelectedCategories");
  //     const selectedCategories = JSON.parse(result) || [];

  //     // Get the default categories
  //     const allCategories = categoriesData[1] || [];

  //     // Filter and order the categories
  //     const selectedCategoriesObjects = allCategories.filter(category => selectedCategories.includes(category.name));
  //     const remainingCategories = allCategories.filter(category => !selectedCategories.includes(category.name));

  //     // Initialize with Pharmacy and Restaurants
  //     const ordered = [
  //       allCategories[0], // Pharmacy
  //       allCategories[1], // Restaurants
  //       ...selectedCategoriesObjects, // Selected categories
  //       ...remainingCategories // Remaining categories
  //     ];

  //     // Ensure Pharmacy and Restaurants are not duplicated
  //     const uniqueOrdered = ordered.filter((category, index, self) =>
  //       index === self.findIndex((c) => c.id === category.id)
  //     );

  //     setOrderedCategories(uniqueOrdered);

  //     console.log('Ordered Categories:', uniqueOrdered);
  //   } catch (error) {
  //     console.log('Error retrieving selected categories:', error);
  //   }
  // };

  // const addToCart = (category) => {
  //   setCartItems([...cartItems, category]);
  // };

  

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
        {/* <TouchableOpacity onPress={() => setCartVisible(true)} style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#000" />
        </TouchableOpacity> */}
      </View>
      {/* 
      <ScrollView style={styles.categoryContainer}>
        {orderedCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => {
              addToCart(category);
              navigation.navigate("StoreInventory", {selectedCategory:  category.name});
            }}
          >
            <View style={styles.card}>
              <Image source={{ uri: category.image }} style={styles.image} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* Cart Modal */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={cartVisible}
        onRequestClose={() => setCartVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cart Items</Text>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <Text key={index} style={styles.modalItem}>{item.name}</Text>
              ))
            ) : (
              <Text style={styles.modalItem}>No items in cart</Text>
            )}
            <Button title="Close" onPress={() => setCartVisible(false)} />
          </View>
        </View>
      </Modal> */}

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
