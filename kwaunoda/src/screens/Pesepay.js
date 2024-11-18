import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const PesePaymentScreen = ({ route }) => {
  const { url } = route.params; // Get the URL passed from the Wallet component

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} style={{ flex: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PesePaymentScreen;