import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

import Home from '../components/home/home'
import Register from '../components/register/register'
import Login from '../components/login/login'
import Playgame from '../components/playgame/playgame'

export default class Routes extends Component {

    state = {
        user: null,
    }

    async componentDidMount() {
        const user = await AsyncStorage.getItem('@UserApi:user')
        const money = await AsyncStorage.getItem('@UserApi:money')
        if (user && money) {
            this.setState({ user: true })
        } else {
            this.setState({ user: false })
        }
    }

    render() {
        if (this.state.user === null) {
            return (
                <View></View>
            )
        } else if(this.state.user === true) {
            return (<Playgame/>)
        }
         else {
            return (
                <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={Home} options={{ title: 'Inicio', headerLeft: null }} />
                    <Stack.Screen name="Register" component={Register} options={{ title: 'Registrar-se' }} />
                    <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
            )
        }
    }
}