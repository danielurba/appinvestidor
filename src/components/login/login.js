import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart'

// const { AsyncStorage } = require('react-native');

import Parse from '../../config/api'

class Login extends Component {

    state = {
        response: {
            user: null,
            password: null
        }
    }

    setUser = (text) => {
        const response = { ...this.state.response }
        response.user = text
        this.setState({ response })
    }

    setPassword = (text) => {
        const response = { ...this.state.response }
        response.password = text
        this.setState({ response })
    }

    toLogin = async () => {
        Parse.User.logIn(this.state.response.user, this.state.response.password).then((user) => {
            const User = new Parse.User();
            const query = new Parse.Query(User);
            query.get(user.id).then((user) => {
                console.log(user);
            }, (error) => {
                console.error(error);
            });
        }).catch(error => {
            if (error.code === 200) {
                Alert.alert('Usuário/Senha vazios !')
            }
            if (error.code === 201) {
                Alert.alert('Senha está vazia !')
            }
            if (error.code === 101) {
                Alert.alert('Usuário e senha inválidos !')
            }
        })
        // const response = await api.post('/login', this.state.response)
        // if(response.problem === "NETWORK_ERROR") {
        //     return Alert.alert('Sem conexão com a internet !!')
        // }
        // if(response.ok) {
        //     if(response.data.idArray) {
        //         await AsyncStorage.multiSet([
        //             ['@UserApi:idArray', JSON.stringify(response.data.idArray)]
        //         ])
        //     }
        //     await AsyncStorage.multiSet([
        //         ['@UserApi:user', response.data.user],
        //         ['@UserApi:playday', JSON.stringify(response.data.playday)],
        //         ['@UserApi:money', response.data.money],
        //         ['@UserApi:email', response.data.email]
        //     ])
        //     RNRestart.Restart()
        // }
        // if(response.status === 400) {
        //     Alert.alert(response.data.msg)
        // }
    }

    render() {
        return (
            <View style={styles.form}>
                <View>
                    <TextInput style={styles.inputs} placeholder="Email..." onChangeText={this.setUser} />
                    <TextInput style={styles.inputs} placeholder="Senha..." onChangeText={this.setPassword} />
                    <Button title="Entrar" onPress={this.toLogin} />
                </View>
            </View>
        )
    }
}

export default function (props) {
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