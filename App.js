import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import Routes from './src/routes'

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  
});
