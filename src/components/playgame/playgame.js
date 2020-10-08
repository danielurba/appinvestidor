import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import {View, Text, StyleSheet} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

class Playgame extends Component {

    state = {
        userLog: null
    }

    async componentDidMount() {
        const user = await AsyncStorage.getItem('@UserApi:user')
        if(!!user) {
            this.setState({ userLog: user })
        }
    }

    render() {
        const { navigation } = this.props

        this.constNavigation = navigation

        const clearStorage = async () => {
            navigation.navigate('Home')
            await AsyncStorage.clear()
        }
        return(
            <View>
                <Text>Playgame</Text>
                <TouchableOpacity style={styles.button} onPress={clearStorage}>
                        <Text style={styles.textButton}>Sair</Text>
                </TouchableOpacity>
                { !!this.state.userLog && <Text>{this.state.userLog}</Text>}
            </View>
        )
    }
}

export default function(props) {
    const navigation = useNavigation();
      
    return <Playgame {...props} navigation={navigation} />;
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
    },
    textButton: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        color: '#fff'
    },
})