import React, { Component } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image, ImageBackground, TextInput, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart'
import Ionicons from 'react-native-ionicons'
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import { create } from 'apisauce'

const api = create({
    baseURL: "https://parseapi.back4app.com",
    headers: {
        'X-Parse-Application-Id': '4wnNLOuVc2xLqO8aqc3MuIxvdt9D1gOUnDziaprL',
        'X-Parse-REST-API-Key': 'J1SmLLJfFWBWCRLLt0SXbvGy0IQuOdT58Ylt0uPv',
        'Content-Type': 'application/json'
    }

})

import Parse from '../../config/api'

export default class Home extends Component {

    state = {
        response: {
            user: null,
            userEmail: null,
            password: null
        },
        register: 'login',
        resetPassword: false,
        textRegisterLogin: 'Não tem conta ? Registre-se'
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

    toShowMessage = (msg, type) => {
        showMessage({
            message: msg,
            type: type,
            style: { bottom: 250 },
            position: 'center'
        })
    }

    toLogin = async () => {
        if (!this.state.response.userEmail) {
            return this.toShowMessage('Email/Usuário vazio !', 'danger')
        }
        if (!this.state.response.password) {
            return this.toShowMessage('Senha esta Vazia !', 'danger')
        }
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
                    const datelastplay = person.get('datelastplay')

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
                    if (datelastplay === undefined) {
                        await AsyncStorage.multiSet([
                            ['@UserApi:datelastplay', JSON.stringify(null)]
                        ])
                    }
                    if (datelastplay) {
                        await AsyncStorage.multiSet([
                            ['@UserApi:datelastplay', JSON.stringify(datelastplay)]
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
                this.toShowMessage('Sem conexão com a Internet !', 'danger')
            }
            if (error.code === 101) {
                this.toShowMessage('Usuário e senha inválidos !', 'warning')
            }
            if (error.code === 205) {
                this.toShowMessage('Por favor Verifique seu email !!', 'warning')
            }
        })
    }

    pageRegister = () => {
        if (this.state.register === 'login') {
            this.setState({ register: 'register' })
            this.setState({ textRegisterLogin: 'Voltar para login' })
        } else if (this.state.register === 'register') {
            this.setState({ register: 'login' })
            this.setState({ textRegisterLogin: 'Não tem conta ? Registre-se' })
        } else if (this.state.register === 'resetPassword') {
            this.setState({ register: 'login' })
            this.setState({ textRegisterLogin: 'Não tem conta ? Registre-se' })
            this.setState({ resetPassword: false })
        }
    }

    toRegister = async () => {
        const user = new Parse.User()

        user.set('username', this.state.response.user);
        if (!this.state.response.userEmail) {
            return this.toShowMessage('Usuário/Email/Senha vazio!', 'warning')
        }

        user.set('email', this.state.response.userEmail);
        user.set('password', this.state.response.password);
        const params = { "email": this.state.response.userEmail };
        api.post('/verificationEmailRequest', params).then(() => {
            this.setState({ register: false })
        })
        user.signUp().then(
            () => {
                this.toShowMessage('Verifique seu email para logar-se!', 'info')
            },
            (error) => {
                if (error.code === 100) {
                    this.toShowMessage('Sem conexão com a Internet !', 'danger')
                }
                if (error.code === 202 || error.code === 203) {
                    this.toShowMessage('Email/Usuário já existem !!', 'warning')
                }
                if (error.code < 0) {
                    this.toShowMessage('Usuário/Email/Senha vazio !', 'warning')
                }
                if (error.code === 125) {
                    this.toShowMessage('Endereço de email inválido !', 'warning')
                }
            }
        );
    }

    toResetPassword = () => {
        this.setState({ resetPassword: true })
        this.setState({ register: 'resetPassword' })
        this.setState({ textRegisterLogin: 'Voltar para login' })
    }

    toSendEmailResetPassword = () => {
        Parse.User.requestPasswordReset(this.state.response.userEmail).then(() => {
            this.toShowMessage(`Email enviado para ${this.state.response.userEmail}`)
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <ImageBackground source={require('../../img/backgroundhome.jpg')} style={{ flex: 1, width: null, height: null }}>
                <StatusBar backgroundColor="transparent" translucent={true} />
                <View style={styles.home}>
                    <Image style={{ width: 100, height: 100, marginTop: 40 }} source={require('../../img/iconapp.png')} />
                    <View style={styles.form}>
                        <View>
                            {this.state.register === 'register' && <View style={styles.inputsIconsContainer}>
                                <View style={styles.inputsIcons}>
                                    <Ionicons name="ios-person" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                </View>
                                <TextInput style={styles.inputs} placeholder="Nome do usuário..." onChangeText={this.setUser} />
                            </View>}
                            {this.state.register === 'register' && <View style={styles.inputsIconsContainer}>
                                <View style={styles.inputsIcons}>
                                    <Ionicons name="ios-mail" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                </View>
                                <TextInput style={styles.inputs} placeholder="E-mail..." onChangeText={this.setUserEmail} />
                            </View>}
                            {this.state.register === 'resetPassword' && <View style={styles.inputsIconsContainer}>
                                <View style={styles.inputsIcons}>
                                    <Ionicons name="ios-mail" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                </View>
                                <TextInput style={styles.inputs} placeholder="E-mail..." onChangeText={this.setUserEmail} />
                            </View>}
                            {this.state.register === 'login' && <View style={styles.inputsIconsContainer}>
                                <View style={styles.inputsIcons}>
                                    <Ionicons name="ios-mail" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                </View>
                                <TextInput style={styles.inputs} placeholder="E-mail/Usuário..." onChangeText={this.setUserEmail} />
                            </View>}
                            {!this.state.resetPassword && <View style={styles.inputsIconsContainer}>
                                <View style={styles.inputsIcons}>
                                    <Ionicons name="ios-lock" size={30} color={'#333'} style={{ justifyContent: 'center', alignItems: 'center' }} />
                                </View>
                                <TextInput secureTextEntry={true} style={styles.inputs} placeholder="Senha..." onChangeText={this.setPassword} />
                            </View>}
                            {this.state.register === 'login' && <TouchableOpacity onPress={this.toLogin}>
                                <LinearGradient colors={['#0086ff', '#0a00bd']} style={styles.buttonHome}>
                                    <Text style={styles.textButton}>Entrar</Text>
                                </LinearGradient>
                            </TouchableOpacity>}
                            <LoginButton readPermissions={['public_profile']}d
                                permissions={["email"]}
                                onLoginFinished={(error, result) => {
                                    if (error) {
                                        alert(error);
                                        console.log('Login has error: ' + result.error);
                                    } else if (result.isCancelled) {
                                        alert('Login is cancelled.');
                                    } else {
                                        AccessToken.getCurrentAccessToken().then((data) => {
                                            console.log(data.accessToken.toString());
                                            const processRequest = new GraphRequest(
                                                '/me?fields=name,email,picture.type(large)',
                                                null,
                                                (error, result) => {console.log(result)}
                                            );
                                            // Start the graph request.
                                            new GraphRequestManager()
                                                .addRequest(processRequest).start();
                                        });
                                    }
                                }} />
                            {this.state.register === 'register' && <TouchableOpacity onPress={this.toRegister}>
                                <LinearGradient colors={['#0086ff', '#0a00bd']} style={styles.buttonHome}>
                                    <Text style={styles.textButton}>Registrar-se</Text>
                                </LinearGradient>
                            </TouchableOpacity>}
                            {this.state.register === 'resetPassword' && <TouchableOpacity onPress={this.toSendEmailResetPassword}>
                                <LinearGradient colors={['#0086ff', '#0a00bd']} style={styles.buttonHome}>
                                    <Text style={styles.textButton}>Resetar senha</Text>
                                </LinearGradient>
                            </TouchableOpacity>}
                        </View>
                    </View>
                    <View style={styles.registerbar}>
                        {this.state.register === 'login' && <TouchableOpacity style={styles.button} onPress={this.toResetPassword}>
                            <Text style={styles.textButton}>Esqueci a minha senha</Text>
                        </TouchableOpacity>}
                        <TouchableOpacity style={styles.button} onPress={this.pageRegister}>
                            <Text style={styles.textButton}>{this.state.textRegisterLogin}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlashMessage position="top" />
            </ImageBackground>
        )
    }
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
        width: 280,
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