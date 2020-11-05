import React, { Component } from 'react';
import { Alert, Button, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import RNRestart from 'react-native-restart'

import Parse from '../../config/api'

class Register extends Component {

    state = {
        response: {
            user: null,
            email: null,
            password: null
        }
    }

    clearStorage = async () => {
        await AsyncStorage.clear()
        // RNRestart.Restart()
    }

    setUser = (text) => {
        const response = { ...this.state.response }
        response.user = text
        this.setState({ response })
    }

    setEmail = (text) => {
        const response = { ...this.state.response }
        response.email = text
        this.setState({ response })
    }

    setPassword = (text) => {
        const response = { ...this.state.response }
        response.password = text
        this.setState({ response })
    }

    toRegister = async () => {
        const user = new Parse.User()

        user.set('username', this.state.response.user);
        if (!this.state.response.email) {
            return Alert.alert('Usuário/Email/Senha vazio!')
        }
        user.set('email', this.state.response.email);
        user.set('password', this.state.response.password);
        user.signUp().then(
            (result) => {
                const Person = Parse.Object.extend("User");
                const query = new Parse.Query(Person);

                query.get(result.id)
                    .then(async (person) => {
                        const name = person.get("username");
                        const playday = person.get("playday")
                        const money = person.get("money");
                        const email = person.get("email")

                        await AsyncStorage.multiSet([
                            ['@UserApi:idUser', person.id],
                            ['@UserApi:user', name],
                            ['@UserApi:playday', JSON.stringify(playday)],
                            ['@UserApi:money', money],
                            ['@UserApi:email', email],
                            ['@UserApi:idArray', JSON.stringify(null)]
                        ])
                        RNRestart.Restart()

                    }, (error) => {
                        alert(error.message);
                    });
            },
            (error) => {
                if (error.code === 100) {
                    Alert.alert('Sem conexão com a internet !!')
                }
                if (error.code === 202 || error.code === 203) {
                    Alert.alert('Email/Usuário já existem !!')
                }
                if (error.code < 0) {
                    Alert.alert('Usuário/Email/Senha vazio !')
                }
                if (error.code === 125) {
                    Alert.alert('Endereço de email inválido !')
                }
            }
        );
    }

    render() {
        return (
            <ImageBackground source={require('../../img/backgroundhome.jpg')} style={{ flex: 1, width: null, height: null }}>
                <View style={styles.form}>
                    <View>
                        <TextInput style={styles.inputs} placeholder="Nome Usuário..." onChangeText={this.setUser} />
                        <TextInput style={styles.inputs} placeholder="Email..." onChangeText={this.setEmail} />
                        <TextInput style={styles.inputs} placeholder="Senha..." onChangeText={this.setPassword} />
                        <Button title="Registrar-se" onPress={this.toRegister} />
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

export default function (props) {
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