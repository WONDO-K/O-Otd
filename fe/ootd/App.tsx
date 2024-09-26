import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Navbar from './components/Navbar';
import Footerbar from './components/Footerbar';
import MainView from './views/MainView';
import LoginView from './views/LoginView';
import AIView from './views/AIView.tsx';
import Battle from './views/Battle'
import BattleDetail from './views/BattleDetail'
import BattleResult from './views/BattleResult'
import Notification from './views/Notification'
import Challenge from './views/Challenge'
import ChallengeDetail from './views/ChallengeDetail'
import MyFashion from './views/MyFashion';
import SplashScreen from 'react-native-splash-screen';
import AIReport from './views/AIReport.tsx';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


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
            <Stack.Screen name="MyFashion" component={MyFashion}/>
            <Stack.Screen name="Battle" component={Battle} />
            <Stack.Screen name="BattleDetail" component={BattleDetail} />
            <Stack.Screen name="BattleResult" component={BattleResult} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="Challenge" component={Challenge} />
            <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
            <Stack.Screen name="AIReport" component={AIReport} />
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
