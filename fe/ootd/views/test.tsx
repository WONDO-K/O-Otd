import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

const App = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', // 'photo', 'video', 또는 'mixed'
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('사용자가 취소했습니다.');
      } else if (response.errorMessage) {
        console.log('에러:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        if (selectedImageUri) {
          setImageUri(selectedImageUri); // string 타입만 설정
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="갤러리에서 사진 선택" onPress={selectImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});

export default App;
