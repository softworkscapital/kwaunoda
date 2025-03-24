import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { API_URL_STORE, API_URL_UPLOADS } from "./config";


  const StoreInventory = () => {
    const navigation = useNavigation();
    const [cartVisible, setCartVisible] = useState(false);
    const [itemModalVisible, setItemModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [mainImage, setMainImage] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [viewCount, setViewCount] = useState(0);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const route = useRoute();
    const { selectedCategory } = route.params;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log("selectedCategory", selectedCategory);
          const resp = await fetch(
            `${API_URL_STORE}/productdefinition/all_stores_full_products_definitions_by_category/${selectedCategory}`
          );
          const result = await resp.json();
          console.log("result", result);
  
          const categoryMap = {};
          const productIds = new Set();
  
          result.forEach((product) => {
            const category = product.category || "Other";
            const subCategory = product.sub_category || "Other";
  
            if (!categoryMap[category]) {
              categoryMap[category] = { id: category, name: category, items: [] };
            }
  
            if (!productIds.has(product.product_id)) {
              productIds.add(product.product_id);
  
              const imageRef = product.uploaded_product_image_ref
                ? product.uploaded_product_image_ref.replace(/\\/g, "/")
                : "default_image_path.png";
  
              categoryMap[category].items.push({
                id: product.product_id,
                name: product.product_brand,
                image: `${API_URL_UPLOADS}/${imageRef}`,
                price: product.selling_price,
                notes: product.description_notes,
                item_count: product.qty_balance,
                category: product.category,
                sub_category: subCategory,
              });
            }
          });
  
          const categoriesArray = Object.values(categoryMap);
          setAllProducts(categoriesArray);
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      };
  
      const intervalId = setTimeout(() => {
        fetchData();
      }, 2000);
  
      return () => clearTimeout(intervalId);
    }, []);
  
    useEffect(() => {
      if (selectedItem) {
        setViewCount(0);
      }
    }, [selectedItem]);
  
    useEffect(() => {
      if (itemModalVisible) {
        setViewCount((prevCount) => prevCount + 1);
      }
    }, [itemModalVisible]);
  
    const handleCardPress = (item) => {
      setSelectedItem(item);
      setMainImage(item.image);
      setItemModalVisible(true);
    };
  
    const handleAddToCart = () => {
      if (selectedItem) {
        setCartItems((prevItems) => {
          const existingItem = prevItems.find(
            (cartItem) => cartItem.id === selectedItem.id
          );
  
          const totalQuantity = existingItem
            ? existingItem.quantity + quantity
            : quantity;
          if (totalQuantity > selectedItem.item_count) {
            alert("Cannot add more than available stock.");
            return prevItems;
          }
  
          if (existingItem) {
            return prevItems.map((item) =>
              item.id === selectedItem.id
                ? { ...item, quantity: totalQuantity }
                : item
            );
          } else {
            return [...prevItems, { ...selectedItem, quantity }];
          }
        });
        setItemModalVisible(false);
      }
    };
  
    const handleQuantityChange = (itemId, change) => {
      setCartItems((prevItems) => {
        return prevItems
          .map((item) => {
            if (item.id === itemId) {
              const newQuantity = item.quantity + change;
  
              if (newQuantity < 1) {
                return null;
              }
              if (newQuantity > item.item_count) {
                alert("Cannot exceed available stock.");
                return item;
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter((item) => item !== null);
      });
    };
  
    const handleRemoveFromCart = (itemId) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    };
  
    const handleCheckout = () => {
      console.log("Checkout function called. Cart items:", cartItems);
      alert("Proceeding to checkout!");
    };
  
    const calculateTotal = () => {
      return cartItems
        .reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
        .toFixed(2);
    };










    
  
    // Extract unique subcategories
    const subCategories = [...new Set(allProducts.flatMap(category => category.items.map(item => item.sub_category)))];
  
    // Filter products based on selected subcategory
    const filteredProducts = selectedSubCategory
      ? allProducts.map(category => ({
          ...category,
          items: category.items.filter(item => item.sub_category === selectedSubCategory),
        }))
      : allProducts;


      const groupedProducts = allProducts.map(category => {
        const subCategoryMap = {};
    
        category.items.forEach(item => {
          const subCategory = item.sub_category || "Other";
          if (!subCategoryMap[subCategory]) {
            subCategoryMap[subCategory] = {
              subCategory,
              items: []
            };
          }
          subCategoryMap[subCategory].items.push(item);
        });
    
        return {
          ...category,
          subCategories: Object.values(subCategoryMap)
        };
      });
    
      // Reorder subcategories based on the selected one
      const orderedSubCategories = groupedProducts.map(category => {
        const sortedSubCategories = [...category.subCategories];
        if (selectedSubCategory) {
          const selected = sortedSubCategories.find(sub => sub.subCategory === selectedSubCategory);
          if (selected) {
            sortedSubCategories.splice(sortedSubCategories.indexOf(selected), 1);
            sortedSubCategories.unshift(selected);
          }
        }
        return {
          ...category,
          subCategories: sortedSubCategories
        };
      });

      const dummyStores = [
        {
          name: "Tech Haven",
          image: "https://picsum.photos/200",
          rating: 4.8
        },
        {
          name: "Fashion Hub",
          image: "https://picsum.photos/201",
          rating: 4.6
        },
        // Add more dummy stores
      ];
      
      const flashDeals = [
        {
          id: 1,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 2,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 3,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 1,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 2,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 3,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 1,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 2,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 3,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 1,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 2,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        {
          id: 3,
          name: "Wireless Earbuds",
          image: "https://picsum.photos/202",
          price: 29.99,
          discount: 50
        },
        // Add more flash deals
      ];
      
      const getCategoryIcon = (category) => {
        // Return appropriate MaterialIcons name based on category
        const iconMap = {
          'Electronics': 'devices',
          'Fashion': 'style',
          'Home': 'home',
          // Add more mappings
        };
        return iconMap[category] || 'category';
      };

      return (
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <View style={styles.searchBox}>
                <MaterialIcons name="search" size={24} color="#666" />
                <TextInput 
                  placeholder="Search products" 
                  style={styles.searchInput}
                />
                <MaterialIcons name="camera-alt" size={24} color="#666" />
              </View>
              <TouchableOpacity onPress={() => setCartVisible(true)} style={styles.cartButton}>
                <MaterialIcons name="shopping-cart" size={24} color="#000" />
                {cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
      
          <ScrollView style={styles.mainContent}>
            {/* Featured Stores Section */}
            <View style={styles.storesSection}>
              <Text style={styles.sectionTitle}>Featured Stores</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dummyStores.map((store, index) => (
                  <TouchableOpacity key={index} style={styles.storeCard}>
                    <Image source={{ uri: store.image }} style={styles.storeImage} />
                    <View style={styles.storeInfo}>
                      <Text style={styles.storeName}>{store.name}</Text>
                      <Text style={styles.storeRating}>
                        <MaterialIcons name="star" size={16} color="#FFD700" />
                        {store.rating}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
      
            {/* Categories Grid */}
            <View style={styles.categoriesGrid}>
              <Text style={styles.sectionTitle}>Shop By Category</Text>
              <View style={styles.gridContainer}>
                {subCategories.map((category, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.categoryGridItem}
                    onPress={() => setSelectedSubCategory(category)}
                  >
                    <MaterialIcons 
                      name={getCategoryIcon(category)} 
                      size={32} 
                      color="#333"
                    />
                    <Text style={styles.categoryGridText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
      
            {/* Flash Deals */}
            <View style={styles.flashDealsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Flash Deals</Text>
                <Text style={styles.timerText}>05:23:45</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {flashDeals.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.flashDealCard}
                    onPress={() => handleCardPress(item)}
                  >
                    <Image source={{ uri: item.image }} style={styles.flashDealImage} />
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>-{item.discount}%</Text>
                    </View>
                    <Text style={styles.flashDealPrice}>${item.price.toFixed(2)}</Text>
                    <Text style={styles.originalPrice}>${(item.price * 1.5).toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
      
            {/* Main Products Grid */}
            <View style={styles.productsGrid}>
              {orderedSubCategories.map((category) => (
                <View key={category.id}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>{category.name}</Text>
                    <TouchableOpacity>
                      <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productsRow}>
                    {category.subCategories.map((subCategory) => (
                      subCategory.items.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.productCard}
                          onPress={() => handleCardPress(item)}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={styles.productImage}
                            resizeMode="cover"
                          />
                          <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>
                              {item.name}
                            </Text>
                            <Text style={styles.productPrice}>
                              US ${item.price.toFixed(2)}
                            </Text>
                            <Text style={styles.moqText}>
                              MOQ: {item.minimum_order || 1} piece(s)
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
  
        {/* Modal for item details */}
        <Modal visible={itemModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {selectedItem && (
                <>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: mainImage }} style={styles.modalImage} />
                    <TouchableOpacity
                      style={styles.likeButton}
                      onPress={() => setIsLiked(!isLiked)}
                    >
                      <MaterialIcons name="favorite" size={24} color={isLiked ? "red" : "gray"} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  <Text style={styles.modalPrice}>Price: ${(selectedItem.price || 0).toFixed(2)}</Text>
                  <Text style={styles.modalDescription}>{selectedItem.notes}</Text>
                  <Text style={styles.modalDescription}>Items Left: {selectedItem.item_count}</Text>
  
                  {/* Quantity Controls */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <MaterialIcons name="remove" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.quantityDisplay}>
                      <Text style={styles.cartItemQuantity}>{quantity}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(quantity + 1)}
                    >
                      <MaterialIcons name="add" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
  
                  {/* Scrollable Additional Images */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollContainer}>
                    {selectedItem && selectedItem.uploaded_product_image_ref && (
                      <TouchableOpacity onPress={() => setMainImage(selectedItem.uploaded_product_image_ref)}>
                        <Image
                          source={{ uri: `${API_URL_UPLOADS}/${selectedItem.uploaded_product_image_ref.replace(/\\/g, "/")}` }}
                          style={styles.additionalImage}
                        />
                      </TouchableOpacity>
                    )}
                    {selectedItem && selectedItem.uploaded_product_image_ref2 && (
                      <TouchableOpacity onPress={() => setMainImage(selectedItem.uploaded_product_image_ref2)}>
                        <Image
                          source={{ uri: `${API_URL_UPLOADS}/${selectedItem.uploaded_product_image_ref2.replace(/\\/g, "/")}` }}
                          style={styles.additionalImage}
                        />
                      </TouchableOpacity>
                    )}
                  </ScrollView>
  
                  {/* Eye Icon for View Count */}
                  <View style={styles.viewCountContainer}>
                    <MaterialIcons name="visibility" size={24} color="gray" />
                    <Text style={styles.viewCountText}>{viewCount} views</Text>
                  </View>
  
                  {/* Modal Actions */}
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setItemModalVisible(false)}
                    >
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddToCart}
                    >
                      <Text style={styles.buttonText}>Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
  
        {/* Cart Modal */}
        <Modal visible={cartVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainerCart}>
              <Text style={styles.modalTitle}>Shopping Cart</Text>
              <ScrollView>
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>${(item.price || 0).toFixed(2)} x {item.quantity}</Text>
  
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(item.id, -1)}
                        style={styles.quantityButton}
                      >
                        <MaterialIcons name="remove" size={24} color="black" />
                      </TouchableOpacity>
                      <View style={styles.quantityDisplay}>
                        <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleQuantityChange(item.id, 1)}
                        style={styles.quantityButton}
                      >
                        <MaterialIcons name="add" size={24} color="black" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveFromCart(item.id)}
                      style={styles.removeButton}
                    >
                      <MaterialIcons name="close" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCartVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <Text style={styles.buttonText}>Checkout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },
  inventoryContainer: {
    flex: 1,
    padding: 7,
  },
  subCategoryContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  subCategoryButton: {
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedSubCategory: {
    backgroundColor: '#d3d3d3',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemsScroll: {
    flexDirection: "row",
  },
  itemCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    // borderColor: "black",
    // borderWidth: 0.5,

    padding: 4,
    paddingHorizontal: 5,
    paddingBottom: 12,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 250,
  },
  itemImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: "#e74c3c",
  },
  itemDescription: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 5,
  },
  cartButton: {
    paddingRight: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  pickerItem: {
    height: 44,
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainerCart: {
    width: "90%", // Width of the modal
    maxHeight: "60%", // Max height of the modal
    backgroundColor: "white", // White background for the modal
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 18,
    paddingHorizontal: 15,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  additionalImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  scrollContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  modalContainer: {
    width: "90%", // Width of the modal
    maxHeight: "100%", // Max height of the modal
    backgroundColor: "white", // White background for the modal
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 7,
    paddingHorizontal: 12,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  modalTitle: {
    position: "absolute", // Position it absolutely
    top: 20, // Adjust to place it where you want
    left: 20, // Adjust to center or position it
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white", // Make sure the text is visible over the image
  },
  modalImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    color: "#2ecc71",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  quantityButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    padding: 5,
    marginHorizontal: 5,
  },
  quantityDisplay: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 9,
    marginRight: 10,
  },
  cartItemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItemPrice: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  cartItemQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  removeButton: {
    marginLeft: 10,
  },
  totalContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align buttons to the right
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 5,
  },
  closeButton: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  likeButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
    // backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional: semi-transparent background
    borderRadius: 20,
    padding: 5,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },

  viewCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center", // Center the content
  },
  viewCountText: {
    marginLeft: 5,
    color: "gray",
    fontSize: 14,
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  storesSection: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  storeCard: {
    width: 130,
    marginLeft: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  storeImage: {
    width: '100%',
    height: 130,
  },
  storeInfo: {
    padding: 8,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  categoriesGrid: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  categoryGridItem: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryGridText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  flashDealsSection: {
    marginBottom: 15,
  },
  flashDealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    color: '#ff6a00',
    fontWeight: '600',
    fontSize: 14,
  },
  flashDealCard: {
    width: 150,
    marginLeft: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flashDealImage: {
    width: '100%',
    height: 150,
  },
  discountBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  flashDealPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6a00',
    marginTop: 5,
    marginLeft: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
    marginBottom: 8,
  },
  productsGrid: {
    paddingHorizontal: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    color: '#666',
    fontSize: 14,
  },
  productsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6a00',
    marginBottom: 4,
  },
  moqText: {
    fontSize: 12,
    color: '#666',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  }
});

export default StoreInventory;
