import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart' 

import api from '../../config/api'

class Login extends Component {

    state = {
        response: {
            email: null,
            password: null
        }
    }

    setEmail = (text) => {
        const response = { ...this.state.response}
        response.email = text
        this.setState({ response })
    }

    setPassword = (text) => {
        const response = { ...this.state.response}
        response.password = text
        this.setState({ response })
    }

    toLogin = async () => {
        const response = await api.post('/login', this.state.response)
        if(response.data.msg) {
            Alert.alert(response.data.msg)
        }
        if(response.ok) {
            if(response.data.idArray) {
                await AsyncStorage.multiSet([
                    ['@UserApi:idArray', JSON.stringify(response.data.idArray)]
                ])
            }
            await AsyncStorage.multiSet([
                ['@UserApi:user', response.data.user],
                ['@UserApi:playday', JSON.stringify(response.data.playday)],
                ['@UserApi:money', response.data.money],
                ['@UserApi:email', response.data.email]
            ])
            RNRestart.Restart()
        }
    }

    render() {
        return (
            <View style={styles.form}>
                <View>
                    <TextInput style={styles.inputs} placeholder="Email..." onChangeText={this.setEmail}/>
                    <TextInput style={styles.inputs} placeholder="Senha..." onChangeText={this.setPassword}/>
                    <Button title="Entrar" onPress={this.toLogin}/>
                </View>
            </View>
        )
    }
}

export default function(props) {
    const navigation = useNavigation();
      
    return <Login {...props} navigation={navigation} />;
  }

const styles = StyleSheet.create({
    form: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 500
    },
    inputs: {
        width: 300,
        margin: 10,
        backgroundColor: '#fff'
    }
})