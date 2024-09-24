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

// 메인페이지
function MainView(): React.JSX.Element {
  return (
    <>
    <View style={styles.container} >
      <Carousel />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    resizeMode: 'cover',
    // justifyContent: 'center',
  },
});

export default MainView;
