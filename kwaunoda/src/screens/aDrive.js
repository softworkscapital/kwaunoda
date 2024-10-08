import RNFS from 'react-native-fs';

// Function to save an image
const saveImage = async (uri) => {
  const filePath = `${RNFS.DocumentDirectoryPath}/image.jpg`;

  try {
    await RNFS.downloadFile({ fromUrl: uri, toFile: filePath }).promise;
    console.log('Image saved to:', filePath);
    // Store the filePath in AsyncStorage if needed
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

