import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
    viewTop: {
      height: 60,
      flexDirection: "row",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      width: "100%",
      marginTop: 32,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "space-between",
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    nameContainer: {
      flexDirection: "column",
      flex: 1,
    },
    firstName: {
      fontSize: 13,
      color: "#595959",
      fontWeight: "bold",
    },
    surname: {
      fontSize: 13,
      color: "#595959",
      fontWeight: "bold",
    },
    menuIcon: {
      padding: 10,
    },
    viewMiddle: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
    },
    txtLogin: {
      color: "#595959",
      fontSize: 16,
      textAlign: "center",
    },
    btnButton1: {
      borderRadius: 20,
      backgroundColor: "#FFC000",
      padding: 13,
      width: "60%",
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 40,
      marginTop: 20,
    },
    ribbon: {
      backgroundColor: "#fff",
      width: "100%",
      height: 50,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginTop: 260,
      marginBottom: 20,
    },
    ribbonSection: {
      alignItems: "center",
    },
    ribbonText: {
      color: "#595959",
      fontSize: 12,
    },
  });
  
export default styles;
