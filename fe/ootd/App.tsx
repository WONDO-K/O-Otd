import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ImageBackground,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Navbar from './components/Navbar';
import Footerbar from './components/Footerbar';
import MainView from './views/MainView';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? 'white' : 'black',
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? 'lightgray' : 'darkgray',
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  
  // 스플래시 화면을 보여줌
  SplashScreen.show();

  // 앱이 실행된 후 1.5초 뒤 스플래시 화면을 숨김
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500); // 1.5초 후 스플래시 화면 숨기기
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />

      {/* 스크롤 가능한 콘텐츠 영역에 배경 이미지 적용 */}
      <ImageBackground
        source={require('./assets/Images/BackgroundImg.png')} // 배경 이미지 경로
        style={styles.backgroundImage} // 배경 이미지 스타일 적용
        resizeMode="cover" // 이미지 크기를 화면에 맞게 조정
      >
        {/* 스크롤 가능한 영역 */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <MainView />
        </ScrollView>
      </ImageBackground>

      <Footerbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    display: "flex",
    flex: 1, // 전체 화면을 차지하도록 설정
  },
  backgroundImage: {
    flex: 1, // 화면 전체를 덮도록 설정
  },
  scrollViewContent: {
    flexGrow: 1, // 스크롤 뷰의 내용을 화면에 맞게 확장
    alignContent: 'center', //
    marginTop: 10, //
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
