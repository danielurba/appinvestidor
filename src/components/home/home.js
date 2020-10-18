import React, { Component } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

class Home extends Component {

    render() {
        const { navigation } = this.props

        function navigateToRegist() {
            navigation.navigate('Register')
        }

        function navigateToLogin() {
            navigation.navigate('Login')
        }
        
        return (
            <View style={styles.home}>
                <View>
                    <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
                        <Text style={styles.textButton}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={navigateToRegist}>
                        <Text style={styles.textButton}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    } 
}

export default function(props) {
    const navigation = useNavigation();
      
    return <Home {...props} navigation={navigation} />;
  }

const styles = StyleSheet.create({
    home: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 500
    },
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
    text: {
        width: 100,
        color: '#000',
        backgroundColor: '#333'
    }

})