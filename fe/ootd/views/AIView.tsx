import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { BlurView } from '@react-native-community/blur';

import UploadIcon from '../assets/Icons/Upload_Icon.svg';

// 메인페이지
function AIView(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <>
      <ImageBackground
        source={require('../assets/Images/BackgroundImg.png')} // 배경 이미지 경로
        style={styles.backgroundImage} // 배경 이미지 스타일 적용
        resizeMode="cover" // 이미지 크기를 화면에 맞게 조정
      >
        <View style={styles.container} >
          <Text style={styles.title}>AI 분석</Text>
          <TouchableOpacity
            style={styles.uploadBtn}
          >
            <UploadIcon width={70} height={70} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    resizeMode: 'cover',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1, // 화면 전체를 덮도록 설정
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    color: '#ffffff',
  },
  uploadBtn: {
    borderColor: '#ffffff',
    borderWidth: 7,
    width: "70%",
    height: "70%",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  }

});

export default AIView;
