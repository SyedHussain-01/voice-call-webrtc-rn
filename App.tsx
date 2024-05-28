import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import {NavigationContainer} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Lobby from './src/screens/lobby';
import Room from './src/screens/room';
import {SocketProvider} from './src/context/socketProvider';

function App(): React.JSX.Element {
  const Stack = createStackNavigator();
  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Lobby" component={Lobby} />
          <Stack.Screen name="Room" component={Room} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
}

export default App;

const styles = StyleSheet.create({});
