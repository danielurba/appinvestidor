import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View } from 'react-native';

const Stack = createStackNavigator();

import Home from '../components/home/home'
import Register from '../components/register/register'
import Login from '../components/login/login'
import Playgame from '../components/playgame/playgame'

export default class Routes extends Component {

    render() {
        return (
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerStyle: { backgroundColor: '#248f24'}, headerTintColor: '#fff'}}>
                <Stack.Screen name="Home" component={Home} options={{ title: 'Inicio'}}/>
                <Stack.Screen name="Playgame" component={Playgame} options={{ headerLeft: null}}/>
                <Stack.Screen name="Register" component={Register} options={{ title: 'Registrar-se'}}/>
                <Stack.Screen name="Login" component={Login} />
            </Stack.Navigator>
        )
    }
}