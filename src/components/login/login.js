import React, { Component } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart'

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
            let Person = Parse.Object.extend("User");
            let query = new Parse.Query(Person);

            query.get(user.id)
                .then( async (person) => {
                    const name = person.get("username");
                    const playday = person.get("playday")
                    const money = person.get("money");
                    const email = person.get("email")
                    const idArray = person.get("idArray")
                    if (idArray) {
                        await AsyncStorage.multiSet([
                            ['@UserApi:idArray', JSON.stringify(idArray)]
                        ])
                    }
                    if(idArray === undefined) {
                        await AsyncStorage.multiSet([
                            ['@UserApi:idArray', JSON.stringify(null)]
                        ])
                    }
                    await AsyncStorage.multiSet([
                        ['@UserApi:idUser', person.id],
                        ['@UserApi:user', name],
                        ['@UserApi:playday', JSON.stringify(playday)],
                        ['@UserApi:money', money],
                        ['@UserApi:email', email]
                    ])
                    RNRestart.Restart()
                }, (error) => {
                    alert(error.message);
                });
        }).catch(error => {
            if (error.code === 100) {
                Alert.alert('Sem conexão com a internet !!')
            }
            if (error.code === 200) {
                Alert.alert('Usuário/Senha vazios !')
            }
            if (error.code === 201) {
                Alert.alert('Senha está vazia !')
            }
            if (error.code < 0) {
                Alert.alert('Usuário/Senha vazios !')
            }
            if (error.code === 101) {
                Alert.alert('Usuário e senha inválidos !')
            }
        })
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