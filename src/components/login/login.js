import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

import api from '../../config/api'

class Login extends Component {

    constNavigation = null

    state = {
        response: {
            user: null,
            password: null
        },
        userLog: null,
        ok: null,
    }

    setUser = (text) => {
        const response = { ...this.state.response}
        response.user = text
        this.setState({ response })
    }

    setPassword = (text) => {
        const response = { ...this.state.response}
        response.password = text
        this.setState({ response })
    }

    toLogin = async () => {
        const response = await api.post('/login', this.state.response)
        console.log(response)
    }

    render() {

        const { navigation }  = this.props
        this.constNavigation = navigation

        return (
            <View style={styles.form}>
                <View>
                    <TextInput style={styles.inputs} placeholder="Nome Usuário..." onChangeText={this.setUser}/>
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