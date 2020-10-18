import React, { Component } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import RNRestart from 'react-native-restart' 

import api from '../../config/api'

class Register extends Component {

    state = {
        response: {
            user: null,
            email: null,
            password: null
        }
    }

    setUser = (text) => {
        const response = { ...this.state.response}
        response.user = text
        this.setState({ response })
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

    toRegister = async () => {
        const response = await api.post('/create', this.state.response )
        if(response.data.msg) {
            Alert.alert(response.data.msg)
        }
        if(response.ok) {
            await AsyncStorage.multiSet([
                ['@UserApi:user', this.state.response.user],
                ['@UserApi:playday', JSON.stringify(response.data.playday)],
                ['@UserApi:money', response.data.money],
                ['@UserApi:email', response.data.email]
            ])
            RNRestart.Restart()
        }
        console.log(response)
    }

    render() {
        return (
            <View style={styles.form}>
                <View>
                    <TextInput style={styles.inputs} placeholder="Nome Usuário..." onChangeText={this.setUser}/>
                    <TextInput style={styles.inputs} placeholder="Email..." onChangeText={this.setEmail}/>
                    <TextInput style={styles.inputs} placeholder="Senha..." onChangeText={this.setPassword}/>
                    <Button title="Registrar-se" onPress={this.toRegister} />
                </View>
            </View>
        )
    }
}

export default function(props) {
    const navigation = useNavigation();
      
    return <Register {...props} navigation={navigation} />;
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