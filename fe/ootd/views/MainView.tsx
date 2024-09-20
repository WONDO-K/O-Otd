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

// 메인페이지
function MainView(): React.JSX.Element {
  return (
    <>
    <View style={styles.container} >
      <Text> 메인 페이지임</Text>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default MainView;
