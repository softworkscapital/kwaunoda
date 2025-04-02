import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const AboutUs = () => {
  const navigation = useNavigation();
  const buildDate = new Date().toISOString().split('T')[0]; 
  const websiteUrl = "https://xgolife.com/download-2/";

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
      </View>

      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../src/thumbnails/xgologofootertext.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.2.4</Text>
            <Text style={styles.buildDate}>Build Date: {buildDate}</Text>
          </View>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => handleLinkPress(websiteUrl)}
          >
            <Text style={styles.linkText}>Visit Our Website</Text>
            <MaterialIcons name="open-in-new" size={20} color="#002966" />
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.legalContainer}>
            <TouchableOpacity 
              onPress={() => handleLinkPress(`${websiteUrl}terms-of-use`)}
            >
              <Text style={styles.legalText}>Terms of Use</Text>
            </TouchableOpacity>
            
            <Text style={styles.separator}>|</Text>
            
            <TouchableOpacity 
              onPress={() => handleLinkPress(`${websiteUrl}privacy-policy`)}
            >
              <Text style={styles.legalText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.copyright}>©2025 XGo Life. All Rights Reserved.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC000',
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backArrow: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#000',
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40
  },
  versionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  buildDate: {
    fontSize: 14,
    color: '#666',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffc000',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 32,
  },
  linkText: {
    fontSize: 16,
    color: '#002966',
    fontWeight: '600',
    marginRight: 8,
  },
  footer: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  legalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  legalText: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 8,
  },
  separator: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 8,
  },
  copyright: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20
  },
});

export default AboutUs;