import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Navbar from './components/Navbar';
import Footerbar from './components/Footerbar';
import MainView from './views/MainView';
import LoginView from './views/LoginView';
import AIView from './views/AIView.tsx';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

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
        <NavigationContainer>
          <Navbar />
          <Stack.Navigator
            initialRouteName="MainView"
            screenOptions={{
              headerShown: false, // 모든 화면에서 헤더를 제거
              animationEnabled: false, // 모든 화면에서 전환 애니메이션 비활성화
            }}
          >
            <Stack.Screen name="MainView" component={MainView} />
            <Stack.Screen name="LoginView" component={LoginView} />
            <Stack.Screen name="AIView" component={AIView} />
          </Stack.Navigator>
          <Footerbar />
        </NavigationContainer>
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
