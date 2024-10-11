// App.tsx
import React, { useEffect, useState } from 'react';
import { Text, LogBox, SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import Navbar from './components/Navbar';
import Footerbar from './components/Footerbar';
import MainView from './views/MainView';
import LoginView from './views/LoginView';
import StyleView from './views/StyleView';
import StyleSelect from './views/StyleSelect';
import AIView from './views/AIView.tsx';
import Battle from './views/Battle';
import BattleDetail from './views/BattleDetail';
import BattleResult from './views/BattleResult';
import Notification from './views/Notification';
import Challenge from './views/Challenge';
import ChallengeDetail from './views/ChallengeDetail';
import MyFashion from './views/MyFashion';
import SplashScreen from 'react-native-splash-screen';
import AIReport from './views/AIReport';
import ProfileView from './views/ProfileView';
import axios from 'axios';
import { useLoginStore } from './stores/LoginStore';

import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

LogBox.ignoreAllLogs();

function App(): React.JSX.Element {
  const [currentRoute, setCurrentRoute] = useState("LoginView");
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false); // 네비게이션 준비 상태 추적
  const [unreadCount, setUnreadCount] = useState(0);
  const { accessToken, userId } = useLoginStore();

  // 스플래시 화면
  useEffect(() => {
    SplashScreen.show();
    setTimeout(() => {
      SplashScreen.hide();
      setIsAppLoaded(true);
    }, 1500);  // 1.5초
  }, []);

  const handleStateChange = async (state?: NavigationState) => {
    if (!state) return;
    const currentRouteName = state.routes[state.index]?.name;
    if (currentRouteName) {
      setCurrentRoute(currentRouteName);
      // 모든 페이지 전환 시 요청 보내기
    try {
      const response = await axios.get(`https://j11e104.p.ssafy.io/battle/notifications/unread-count/${userId}`, {
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
          "X-User-ID": userId,
        }
      });
      setUnreadCount(response.data);
      console.log('Data fetched on route change:', response.data);
    } catch (error) {
      console.error('Error fetching data on route change:', error);
    }
    }
  };

  if (!isAppLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer
        onStateChange={handleStateChange}
        onReady={() => setIsReady(true)} // 네비게이션이 준비되면 isReady를 true로 설정
      >
        {/* Navbar는 네비게이션이 준비되었고, 현재 화면이 LoginView가 아닐 때만 렌더링 */}
        {isReady && currentRoute !== 'LoginView' && <Navbar currentRoute={currentRoute} unreadCount={unreadCount} />}

        <Stack.Navigator
          initialRouteName="LoginView"
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

        {/* Footerbar는 네비게이션이 준비되었고, 현재 화면이 LoginView가 아닐 때만 렌더링 */}
        {isReady && currentRoute !== 'LoginView' && <Footerbar currentRoute={currentRoute} />}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // 전체 화면을 차지하도록 설정
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
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
