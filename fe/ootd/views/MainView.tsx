import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image, // 이미지 컴포넌트 추가
} from 'react-native';
import Navbar from '../components/Navbar';
import Footerbar from '../components/Footerbar';
import Carousel from '../components/Carousel';
import { BlurView } from '@react-native-community/blur';

// 메인페이지
function MainView(): React.JSX.Element {
  return (
    <>
    <View style={styles.container} >
      <BlurView
        style={styles.carouselContainer}
        blurType="light" // light, dark, or extra light
        blurAmount={10}  // 블러 강도 조정
      >
          <Carousel />
      </BlurView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: 'black',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // 반투명한 배경
    borderRadius: 15,
    overflow: 'hidden',
  },
});

export default MainView;
