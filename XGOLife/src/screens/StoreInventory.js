import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
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
  const [dummyStores, setDummyStores] = useState([]);
  const [currentCat, setCurrentCategory] = useState();
  const [uniqueSubCategories, setUniqueSubCategories] = useState(new Set());

  useEffect(() => {
    fetchData();
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

  const fetchStores = async () => {
    try {
      const resp = await fetch(
        `${API_URL_STORE}/branches/get_branch_by_branch_type/Virtual`
      );
      const result = await resp.json();
      console.log("Stores result", result);

      // Process the store data
      const storeMap = {};

      result.forEach((store) => {
        const branchName = store.branch_name || "Other";

        if (!storeMap[branchName]) {
          storeMap[branchName] = {
            id: store.branch_id,
            name: branchName,
            image: `${API_URL_UPLOADS}/${store.branch_image.replace(
              /\\/g,
              "/"
            )}`,
            location: store.branch_location,
            phone: store.phone,
            inventoryLevel: store.inventory_level,
            companyName: store.company_name,
          };
        }
      });

      const storesArray = Object.values(storeMap);
      setDummyStores(storesArray); // Update your state to store the fetched stores
    } catch (error) {
      console.log("Error fetching stores:", error);
    }
  };

  // Handle category selection
  const handleCategoryPress = (category) => {
    setCurrentCategory(category);
    if (category === "all") {
      fetchData();
    } else {
      fetchAgain(category);
    }
  };

  const handleSubCategoryPress = (subCategory) => {
    setSelectedSubCategory(subCategory); // Save the selected sub-category
  };

  const fetchData = async () => {
    await fetchStores(); // Assuming this fetches store data

    try {
      console.log("selectedCategory", selectedCategory);

      // Fetch products for each category in selectedCategory
      const allProductsByCategory = await Promise.all(
        selectedCategory.map(async (category) => {
          const resp = await fetch(
            `${API_URL_STORE}/productdefinition/all_stores_full_products_definitions_by_category/${category}`
          );
          const result = await resp.json();
          console.log(`Products for ${category}:`, result);

          return result;
        })
      );

      // Flatten the array of arrays into a single array of products
      const allProducts = allProductsByCategory.flat();

      // Process the products to create a category map
      const categoryMap = {};
      const productIds = new Set();
      const subCategoriesSet = new Set(); // To store unique sub-categories

      allProducts.forEach((product) => {
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

          // Add sub-category to the Set
          subCategoriesSet.add(subCategory);
        }
      });

      // Convert the category map to an array
      const categoriesArray = Object.values(categoryMap);
      setAllProducts(categoriesArray);

      // Update unique sub-categories
      setUniqueSubCategories(subCategoriesSet);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const fetchAgain = async (category) => {
    try {
      console.log("Fetching data for category:", category);

      // Fetch products for the given category
      const resp = await fetch(
        `${API_URL_STORE}/productdefinition/all_stores_full_products_definitions_by_category/${category}`
      );
      const result = await resp.json();
      console.log(`Products for ${category}:`, result);

      // Process the products to create a category map
      const categoryMap = {};
      const productIds = new Set();
      const subCategoriesSet = new Set(); // To store unique sub-categories

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

          // Add sub-category to the Set
          subCategoriesSet.add(subCategory);
        }
      });

      // Convert the category map to an array
      const categoriesArray = Object.values(categoryMap);
      setAllProducts(categoriesArray);

      // Update unique sub-categories
      setUniqueSubCategories(subCategoriesSet);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // Extract unique subcategories
  const subCategories = [
    ...new Set(
      allProducts.flatMap((category) =>
        category.items.map((item) => item.sub_category)
      )
    ),
  ];

  // Filter products based on selected subcategory
  const filteredProducts = selectedSubCategory
    ? allProducts.map((category) => ({
        ...category,
        items: category.items.filter(
          (item) => item.sub_category === selectedSubCategory
        ),
      }))
    : allProducts;

  const groupedProducts = allProducts.map((category) => {
    const subCategoryMap = {};

    category.items.forEach((item) => {
      const subCategory = item.sub_category || "Other";
      if (!subCategoryMap[subCategory]) {
        subCategoryMap[subCategory] = {
          subCategory,
          items: [],
        };
      }
      subCategoryMap[subCategory].items.push(item);
    });

    return {
      ...category,
      subCategories: Object.values(subCategoryMap),
    };
  });

  const currentCategory = allProducts.find(
    (cat) => cat.id === selectedCategory
  );

  // Reorder subcategories based on the selected one
  const orderedSubCategories = groupedProducts.map((category) => {
    const sortedSubCategories = [...category.subCategories];
    if (selectedSubCategory) {
      const selected = sortedSubCategories.find(
        (sub) => sub.subCategory === selectedSubCategory
      );
      if (selected) {
        sortedSubCategories.splice(sortedSubCategories.indexOf(selected), 1);
        sortedSubCategories.unshift(selected);
      }
    }
    return {
      ...category,
      subCategories: sortedSubCategories,
    };
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Store Inventory</Text>
        <TouchableOpacity
          onPress={() => setCartVisible(true)}
          style={styles.cartButton}
        >
          <MaterialIcons name="shopping-cart" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Catergory Selection */}
      <View>
        <ScrollView horizontal style={styles.categoryContainer}>
        {selectedCategory.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategoryPress(category)}
            style={[
              styles.categoryButton,
              currentCategory === category && styles.selectedCategory,
            ]}
          >
            <Text style ={styles.CatTitle}>{category}</Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
     
      </View>

      {/* Display current category */}
      <View style={styles.TitleCat}>
        {currentCat && <Text style={styles.categoryTitle}>{currentCat}</Text>}
      </View>

      {/* Render unique sub-categories */}
      <View style={styles.subCategoryContainer}>
        {Array.from(uniqueSubCategories).map((subCategory) => (
          <TouchableOpacity
            key={subCategory}
            onPress={() => handleSubCategoryPress(subCategory)}
            style={[
              styles.subCategoryButton,
              selectedSubCategory === subCategory && styles.selectedSubCategory,
            ]}
          >
            <Text>{subCategory}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render featured stores */}
      <View style={styles.storesSection}>
        <Text style={styles.sectionTitle}>Featured Stores</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dummyStores.map((store) => (
            <TouchableOpacity key={store.id} style={styles.storeCard}>
              <Image source={{ uri: store.image }} style={styles.storeImage} />
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{store.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Render inventory */}
      <ScrollView style={styles.inventoryContainer}>
        {allProducts.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            {Array.from(uniqueSubCategories).map((subCategory) => {
              // Filter products for this sub-category
              const subCategoryProducts = category.items.filter(
                (item) => item.sub_category === subCategory
              );

              // Only render the sub-category if it has products
              if (subCategoryProducts.length > 0) {
                return (
                  <View key={subCategory} style={styles.subCategorySection}>
                    <TouchableOpacity
                      onPress={() => {
                        handleSubCategoryPress(subCategory);
                      }}
                      style={[
                        styles.subCategoryButton,
                        selectedSubCategory === subCategory &&
                          styles.selectedSubCategory,
                      ]}
                    >
                      <Text>{subCategory}</Text>
                    </TouchableOpacity>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={true}
                      style={styles.itemsScroll}
                    >
                      {subCategoryProducts.map((filteredItem) => (
                        <TouchableOpacity
                          key={filteredItem.id}
                          style={
                            selectedSubCategory === subCategory
                              ? styles.itemCard
                              : styles.alternateProductCard
                          }
                          onPress={() => handleCardPress(filteredItem)}
                        >
                          <Image
                            source={{ uri: filteredItem.image }}
                            style={
                              selectedSubCategory === subCategory
                                ? styles.itemImage
                                : styles.productImage
                            }
                            resizeMode="cover"
                          />
                          <Text style={styles.productName}>
                            {filteredItem.name}
                          </Text>
                          <Text style={styles.productPrice}>
                            Price: ${filteredItem.price.toFixed(2)}
                          </Text>
                          <Text style={styles.itemDescription}>
                            Best Quality {filteredItem.sub_category}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                );
              }

              // If no products exist for this sub-category, return null
              return null;
            })}
          </View>
        ))}
      </ScrollView>

      {/* Modal for item details */}
      <Modal visible={itemModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedItem && (
              <>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: mainImage }}
                    style={styles.modalImage}
                  />
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={() => setIsLiked(!isLiked)}
                  >
                    <MaterialIcons
                      name="favorite"
                      size={24}
                      color={isLiked ? "red" : "gray"}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalPrice}>
                  Price: ${(selectedItem.price || 0).toFixed(2)}
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedItem.notes}
                </Text>
                <Text style={styles.modalDescription}>
                  Items Left: {selectedItem.item_count}
                </Text>

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
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  style={styles.scrollContainer}
                >
                  {selectedItem && selectedItem.uploaded_product_image_ref && (
                    <TouchableOpacity
                      onPress={() =>
                        setMainImage(selectedItem.uploaded_product_image_ref)
                      }
                    >
                      <Image
                        source={{
                          uri: `${API_URL_UPLOADS}/${selectedItem.uploaded_product_image_ref.replace(
                            /\\/g,
                            "/"
                          )}`,
                        }}
                        style={styles.additionalImage}
                      />
                    </TouchableOpacity>
                  )}
                  {selectedItem && selectedItem.uploaded_product_image_ref2 && (
                    <TouchableOpacity
                      onPress={() =>
                        setMainImage(selectedItem.uploaded_product_image_ref2)
                      }
                    >
                      <Image
                        source={{
                          uri: `${API_URL_UPLOADS}/${selectedItem.uploaded_product_image_ref2.replace(
                            /\\/g,
                            "/"
                          )}`,
                        }}
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

            <ScrollView style={styles.Scrrr}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.cartItemImage}
                  />
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>
                    ${(item.price || 0).toFixed(2)} x {item.quantity}
                  </Text>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={() => handleQuantityChange(item.id, -1)}
                      style={styles.quantityButton}
                    >
                      <MaterialIcons name="remove" size={24} color="black" />
                    </TouchableOpacity>
                    <View style={styles.quantityDisplay}>
                      <Text style={styles.cartItemQuantity}>
                        {item.quantity}
                      </Text>
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
                // onPress={{}}
              >
                <Text style={styles.buttonText}>Checkout Comming soon</Text>
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
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  subCategoryButton: {
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  selectedSubCategory: {
    backgroundColor: "#d3d3d3",
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
  },
  TitleCat: {
    paddingLeft: 10,
  },
  itemsScroll: {
    flexDirection: "row",
  },
  itemCard: {
    // backgroundColor: "#f8f8f8",
    // borderRadius: 10,
    // // borderColor: "black",
    // // borderWidth: 0.5,

    // padding: 4,
    // paddingHorizontal: 5,
    // paddingBottom: 12,
    // margin: 10,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // elevation: 3,
    // width: 250,
    width: 200,
    backgroundColor: "#f9f9f9", // Different background for unselected categories
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
    padding: 7,
    // paddingHorizontal: 5,
    paddingBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height: 270,
  },
  itemImage: {
    width: "100%",
    aspectRatio: 1,
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
    width: "70%", // Width of the modal
    maxHeight: "100%", // Max height of the modal
    backgroundColor: "white", // White background for the modal
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 7,
    paddingHorizontal: 7,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    position: "absolute", // Position it absolutely
    top: 10, // Adjust to place it where you want
    left: 10, // Adjust to center or position it
    fontSize: 30,
    fontWeight: "bold",
    paddingHorizontal: 5,
    color: "white",
    borderRadius: 10, // Make sure the text is visible over the image
  },
  modalImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 5,
    // borderWidth: 2,
  },
  modalPrice: {
    fontSize: 18,
    color: "#2ecc71",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
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
    paddingTop: 20,
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
    backgroundColor: "grey",
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
  storeName: {
    fontSize: 12,
    fontWeight: "600",
  },
  storeRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  storeImage: {
    width: "60%",
    height: 70,
    borderRadius: 100,
  },
  storeCard: {
    width: 115,
    marginLeft: 5,
    // backgroundColor: '#fff',
    // borderRadius: 8,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    alignContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  storesSection: {
    marginVertical: 15,
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
  },
  storeInfo: {
    padding: 3,
  },
  alternateProductCard: {
    width: 210,
    backgroundColor: "#f8f8f8", // Different background for unselected categories
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
    padding: 7,
    height: 300,
    paddingHorizontal: 5,
    paddingBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productImage: {
    width: "100%",
    borderRadius: 10,
    aspectRatio: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryButton: {
    padding: 8,
    margin: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: "#007bff",
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  Scrrr: {
    marginTop: 40,
  },
  CatTitle: {
    fontWeight: "bold",
  }
});

export default StoreInventory;
