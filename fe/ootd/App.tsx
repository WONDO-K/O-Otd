/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Navbar from './components/Navbar'
import Footerbar from './components/Footerbar'
import Battle from './views/Battle'
import Test from './views/test'
import Challenge from './views/Challenge'

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
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: 'black',
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <Navbar />
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={{ flexGrow: 1 }} // 스크롤 뷰가 화면을 덮도록
      > */}
        {/* <Battle/> */}
        {/* <Challenge/> */}
        {/* <Test/> */}
      {/* </ScrollView> */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Battle"
          screenOptions={{
            headerShown: false, // 모든 화면에서 헤더를 제거
            animationEnabled: false, // 모든 화면에서 전환 애니메이션 비활성화
          }}
        >
          <Stack.Screen name="Battle" component={Battle} />
          <Stack.Screen name="Challenge" component={Challenge} />
        </Stack.Navigator>
      </NavigationContainer>
      <Footerbar />
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
