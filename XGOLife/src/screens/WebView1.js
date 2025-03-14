import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const WebView1 = ({ url }) => {
  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: 'http://192.168.28.97:3000/Home' }} 
        style={styles.webview} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default WebView1;