import React, { useEffect, useState } from 'react';
import { Text, LogBox, SafeAreaView, StyleSheet } from 'react-native';
import Navbar from './components/Navbar';
import Footerbar from './components/Footerbar';
import MainView from './views/MainView';
import LoginView from './views/LoginView';
import StyleView from './views/StyleView';
import StyleSelect from './views/StyleSelect';
import AIView from './views/AIView.tsx';
import Battle from './views/Battle'
import BattleDetail from './views/BattleDetail'
import BattleResult from './views/BattleResult'
import Notification from './views/Notification'
import Challenge from './views/Challenge'
import ChallengeDetail from './views/ChallengeDetail'
import MyFashion from './views/MyFashion';
import SplashScreen from 'react-native-splash-screen';
import AIReport from './views/AIReport';
import ProfileView from './views/ProfileView';

import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ThemeProvider } from 'styled-components/native';

const Stack = createStackNavigator();
const theme = {
  fonts: {
    regular: 'Pretendard-Regular',
    bold: 'Pretendard-Bold',
  },
};

LogBox.ignoreAllLogs();

function App(): React.JSX.Element {
  const [currentRoute, setCurrentRoute] = useState('MainView');
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // 스플래시 화면
  useEffect(() => {
    SplashScreen.show();
    setTimeout(() => {
      SplashScreen.hide();
      setIsAppLoaded(true);
    }, 1500);  // 1.5초
  }, []);

  const handleStateChange = (state?: NavigationState) => {
    if (!state) return;
    const currentRouteName = state.routes[state.index]?.name;
    if (currentRouteName) {
      setCurrentRoute(currentRouteName);
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer onStateChange={handleStateChange}>
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
            <Stack.Screen name="StyleView" component={StyleView} />
            <Stack.Screen name="StyleSelect" component={StyleSelect} />
            <Stack.Screen name="AIView" component={AIView} />
            <Stack.Screen name="MyFashion" component={MyFashion}/>
            <Stack.Screen name="Battle" component={Battle} />
            <Stack.Screen name="BattleDetail" component={BattleDetail} />
            <Stack.Screen name="BattleResult" component={BattleResult} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="Challenge" component={Challenge} />
            <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
            <Stack.Screen name="AIReport" component={AIReport} />
            <Stack.Screen name="ProfileView" component={ProfileView} />
          </Stack.Navigator>
          <Footerbar currentRoute={currentRoute} />
        </NavigationContainer>
      </SafeAreaView>
    </ThemeProvider>
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
