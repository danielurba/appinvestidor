import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Home from './components/home/home'
import Register from './components/register/register'
import Login from './components/login/login'

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Login" component={Login}/>
        </Stack.Navigator>
    )
}