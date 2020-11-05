import React, { Component } from 'react';
import { Button, Text, View, StyleSheet, Image, ImageBackground, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart'
import Ionicons from 'react-native-ionicons'

import Parse from '../../config/api'

class Home extends Component {

    state = {
        response: {
            user: null,
            userEmail: null,
            password: null
        },
        register: false
    }

    setUserEmail = (text) => {
        const response = { ...this.state.response }
        response.userEmail = text
        this.setState({ response })
    }

    setPassword = (text) => {
        const response = { ...this.state.response }
        response.password = text
        this.setState({ response })
    }

    setUser = (text) => {
        const response = { ...this.state.response }
        response.user = text
        this.setState({ response })
    }

    toLogin = async () => {
        Parse.User.logIn(this.state.response.userEmail, this.state.response.password).then((user) => {
            let Person = Parse.Object.extend("User");
            let query = new Parse.Query(Person);

            query.get(user.id)
                .then(async (person) => {
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
                    if (idArray === undefined) {
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

    pageRegister = () => {
        if (this.state.register) {
            this.setState({ register: false })
        } else {
            this.setState({ register: true })
        }
    }

    toRegister = async () => {
        const user = new Parse.User()

        user.set('username', this.state.response.user);
        if (!this.state.response.userEmail) {
            return Alert.alert('Usuário/Email/Senha vazio!')
        }
        user.set('email', this.state.response.userEmail);
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
        const { navigation } = this.props

        function navigateToRegist() {
            navigation.navigate('Register')
        }

        function navigateToLogin() {
            navigation.navigate('Login')
        }

        return (
            <ImageBackground source={require('../../img/backgroundhome.jpg')} style={{ flex: 1, width: null, height: null }}>
                <View style={styles.home}>
                    <Image style={{ width: 100, height: 100, marginTop: 20 }} source={require('../../img/iconapp.png')} />
                    <View style={styles.form}>
                        <View>
                            {this.state.register && <View style={styles.inputsIconsContainer}>
                                <View style={styles.inputsIcons}>
                                    <Ionicons name="ios-person" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                </View>
                                <TextInput style={styles.inputs} placeholder="Nome do usuário..." onChangeText={this.setUser} />
                            </View>}
                            {this.state.register && <View style={styles.inputsIconsContainer}>
                                <View style={styles.inputsIcons}>
                                    <Ionicons name="ios-mail" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                </View>
                                <TextInput style={styles.inputs} placeholder="E-mail..." onChangeText={this.setUserEmail} />
                            </View>}
                            {!this.state.register && <View style={styles.inputsIconsContainer}>
                                <View style={styles.inputsIcons}>
                                    <Ionicons name="ios-mail" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                </View>
                                <TextInput style={styles.inputs} placeholder="E-mail/Usuário..." onChangeText={this.setUserEmail} />
                            </View>}
                            <View>
                                <View style={styles.inputsIconsContainer}>
                                    <View style={styles.inputsIcons}>
                                        <Ionicons name="ios-lock" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                    </View>
                                    <TextInput style={styles.inputs} placeholder="Senha..." onChangeText={this.setPassword} />
                                </View>
                            </View>
                            {!this.state.register && <TouchableOpacity onPress={this.toLogin}>
                                <LinearGradient colors={['#0086ff', '#01408d', '#020024']} style={styles.buttonHome}>
                                    <Text style={styles.textButton}>Entrar</Text>
                                </LinearGradient>
                            </TouchableOpacity>}
                            {this.state.register && <TouchableOpacity onPress={this.toRegister}>
                                <LinearGradient colors={['#0086ff', '#01408d', '#020024']} style={styles.buttonHome}>
                                    <Text style={styles.textButton}>Registrar-se</Text>
                                </LinearGradient>
                            </TouchableOpacity>}
                        </View>
                    </View>
                    <View style={styles.registerbar}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.textButton}>Esqueci a minha senha</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.pageRegister}>
                            <Text style={styles.textButton}>Não tem conta ? Registre-se</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

        )
    }
}

export default function (props) {
    const navigation = useNavigation();

    return <Home {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
    home: {
        // justifyContent: 'center',
        alignItems: 'center',
        height: '100%'

    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 230,
        marginTop: 10,
        borderRadius: 8,
        height: 40,

    },
    buttonHome: {
        marginTop: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        color: '#fff'
    },
    textButtonHome: {
        color: '#fff',
        fontSize: 18
    },
    text: {
        width: 100,
        color: '#000',
        backgroundColor: '#333'
    },
    form: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 250
    },
    inputs: {
        width: 310,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8
    },
    registerbar: {
        marginVertical: 30
    },
    inputsIcons: {
        width: 50,
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputsIconsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }

})