import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart'
import { ConfirmDialog } from 'react-native-simple-dialogs';
import DialogInput from 'react-native-dialog-input';

import Parse from '../../config/api'

export default class Configuration extends Component {

    state = {
        dialogVisible: false,
        InputVisible: false,
        InputVisibleReset: false
    }

    clearStorage = async () => {
        await AsyncStorage.clear()
        RNRestart.Restart()
    }

    deleteAccount = async () => {
        const User = new Parse.User();
        const query = new Parse.Query(User);

        const idUser = await AsyncStorage.getItem('@UserApi:idUser')

        query.get(idUser).then((user) => {
            user.destroy().then((response) => {
                this.setState({ InputVisible: false, dialogVisible: false })
                Alert.alert("Usuário deletado com sucesso!")
                this.clearStorage()
            }, (error) => {
                console.error(error);
            })
        });
        // const email = await AsyncStorage.getItem('@UserApi:email')
        // const informs = {
        //     email: email,
        //     password: password
        // }

        // const response = await api.post('/delete', informs)
        // if(response.problem === "NETWORK_ERROR") {
        //     return Alert.alert('Sem conexão com a internet !!')
        // }
        // if(response.ok) {
        //     this.setState({ InputVisible: false, dialogVisible: false})
        //     Alert.alert("Usuário deletado com sucesso!")
        //     return this.clearStorage()
        // }
        // if(response.data.msg) {
        //     Alert.alert(response.data.msg)
        // }
    }

    resetarAccount = async () => {
        const User = new Parse.User();
        const query = new Parse.Query(User);

        const idUser = await AsyncStorage.getItem('@UserApi:idUser')

        query.get(idUser).then((user) => {
            user.set('money', '100000');
            user.save().then( async (response) => {
                this.setState({ InputVisibleReset: false, dialogVisibleReset: false })
                await AsyncStorage.multiSet([
                    ['@UserApi:money', JSON.stringify(100000)]
                ])
                Alert.alert("Sua conta foi resetada com sucesso!")
                RNRestart.Restart()
            }).catch((error) => {
                console.error(error.message);
            });
        })
        // const email = await AsyncStorage.getItem('@UserApi:email')
        // const informs = {
        //     email: email,
        //     password: password
        // }
        // const response = await api.post('/reset', informs)
        // if (response.problem === "NETWORK_ERROR") {
        //     return Alert.alert('Sem conexão com a internet !!')
        // }
        // if (response.ok) {
        //     this.setState({ InputVisibleReset: false, dialogVisibleReset: false })
        //     await AsyncStorage.multiSet([
        //         ['@UserApi:money', JSON.stringify(100000)]
        //     ])
        //     Alert.alert("Sua conta foi resetada com sucesso!")
        //     return RNRestart.Restart()
        // }
        // if (response.data.msg) {
        //     Alert.alert(response.data.msg)
        // }
    }

    render() {
        return (
            <ImageBackground source={require('../../img/backgroundhome.jpg')} style={{ flex: 1, width: null, height: null}}>
                <ConfirmDialog
                    title="Você deseja mesmo excluir a conta ?"
                    message="Diga SIM e Digite a senha para excluir!!"
                    visible={this.state.dialogVisible}
                    onTouchOutside={() => this.setState({ dialogVisible: false })}
                    negativeButton={{
                        title: "SIM",
                        onPress: () => this.deleteAccount()
                    }}
                    positiveButton={{
                        title: "NÃO",
                        onPress: () => this.setState({ dialogVisible: false })
                    }}
                />
                <ConfirmDialog
                    title="Você deseja mesmo resetar a conta ?"
                    message="Diga SIM e Digite a senha para resetar!!"
                    visible={this.state.dialogVisibleReset}
                    onTouchOutside={() => this.setState({ InputVisibleReset: false })}
                    negativeButton={{
                        title: "SIM",
                        onPress: () => this.resetarAccount()
                    }}
                    positiveButton={{
                        title: "NÃO",
                        onPress: () => this.setState({ dialogVisibleReset: false })
                    }}
                />
                <TouchableOpacity style={styles.button} onPress={this.clearStorage}>
                    <Text style={styles.textButton}>Sair da conta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.setState({ dialogVisible: true })}>
                    <Text style={styles.textButton}>Excluir conta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.setState({ dialogVisibleReset: true })}>
                    <Text style={styles.textButton}>Resetar conta</Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        marginBottom: 30,
        borderRadius: 8,
        height: 40,
        backgroundColor: '#4da6ff',
        margin: 10
    },
    textButton: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        color: '#fff'
    },
})