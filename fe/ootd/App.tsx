/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Navbar from './components/Navbar'
import Footerbar from './components/Footerbar'
import Battle from './views/Battle'
import BattleDetail from './views/BattleDetail'
import BattleResult from './views/BattleResult'
import Notification from './views/Notification'
import Challenge from './views/Challenge'
import ChallengeDetail from './views/ChallengeDetail'
import MyFashion from './views/MyFashion';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'black',
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <Navbar />
        <Stack.Navigator
          initialRouteName="Notification"
          screenOptions={{
            headerShown: false, // 모든 화면에서 헤더를 제거
            animationEnabled: false, // 모든 화면에서 전환 애니메이션 비활성화
          }}
        >
          <Stack.Screen name="MyFashion" component={MyFashion}/>
          <Stack.Screen name="Battle" component={Battle} />
          <Stack.Screen name="BattleDetail" component={BattleDetail} />
          <Stack.Screen name="BattleResult" component={BattleResult} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Challenge" component={Challenge} />
          <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} />
        </Stack.Navigator>
        <Footerbar />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  highlight: {
    fontWeight: '700',
  },
});

export default App;
