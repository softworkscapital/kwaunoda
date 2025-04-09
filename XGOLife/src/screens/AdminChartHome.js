import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Animated,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons
import * as Animatable from "react-native-animatable"; // Install react-native-animatable

const { width } = Dimensions.get("window");

const CreateChatScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [adminId, setAdminId] = useState("1");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateCreated, setDateCreated] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const scrollY = new Animated.Value(0);
  useEffect(() => {
    const fetchDataAndChats = async () => {
      await fetchData(); // Fetch the customer ID
      if (customerId) {
        await fetchChats(); // Fetch chats if customer ID is available
      }
    };

    fetchDataAndChats();
  }, [customerId]); // Add customerId as a dependency
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.170.214:3011/clientservicechat/customer/${customerId}`
      );
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      Alert.alert("Error", "Failed to fetch chats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const storedIds = await AsyncStorage.getItem("theIds");
      if (storedIds) {
        const parsedIds = JSON.parse(storedIds);
        let acc =
          parsedIds.last_logged_account === "driver"
            ? parsedIds.driver_id
            : parsedIds.customerId;
        setCustomerId(acc);
        await fetchChats(); // Fetch chats after setting customerId
      } else {
        Alert.alert("Account Error", "Please log in again to continue.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load account data.");
    }
  };

  const addNewChat = async () => {
    if (!customerId) {
      Alert.alert(
        "Error",
        "Unable to create chat. Please try logging in again."
      );
      return;
    }

    const newChat = {
      customer_id: customerId,
      date_created: dateCreated,
      admin_id: 1,
    };

    try {
      const response = await fetch(
        "http://192.168.170.214:3011/clientservicechat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newChat),
        }
      );

      const result = await response.json();
      Alert.alert("Success", "New conversation started!");
      fetchChats();
    } catch (error) {
      console.error("Error creating chat:", error);
      Alert.alert("Error", "Failed to create new chat. Please try again.");
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
    fetchChats();
  }, []);

  const renderChatItem = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 100}
      style={styles.chatCardContainer}
    >
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() =>
          navigation.navigate("CustomerAdminChat", {
            chatId: item.client_service_chat_id,
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.chatHeader}>
          <View style={styles.chatIcon}>
            <Ionicons name="chatbubbles-outline" size={24} color="#FFC000" />
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.chatId}>
              Conversation #{item.client_service_chat_id}
            </Text>
            <Text style={styles.dateText}>
              {new Date(item.date_created).toLocaleDateString()}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFC000" />

      <Animatable.View animation="fadeInDown" style={styles.header}>
        <Text style={styles.headerTitle}>Customer Service</Text>
        <Text style={styles.headerSubtitle}>Your Conversations</Text>
      </Animatable.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFC000" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.client_service_chat_id.toString()}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={64} color="#CCC" />
                <Text style={styles.emptyText}>No conversations yet</Text>
              </View>
            }
          />

          <Animatable.View animation="fadeInUp" style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={addNewChat}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.addButtonText}>Start New Conversation</Text>
            </TouchableOpacity>
          </Animatable.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFC000",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#000",
    opacity: 0.8,
    marginTop: 5,
  },
  chatList: {
    padding: 15,
  },
  chatCardContainer: {
    marginBottom: 15,
  },
  chatCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF9E6",
    justifyContent: "center",
    alignItems: "center",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  chatId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: "transparent",
  },
  addButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  emptyText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
});

export default CreateChatScreen;
