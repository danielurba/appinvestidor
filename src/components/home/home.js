import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

export default function Home({ navigation }) {

    function navigateToRegist() {
        navigation.navigate('Register')
    }

    function navigateToLogin() {
        navigation.navigate('Login')
    }
    return (
        <View style={styles.home}>
            <Button title="Login" onPress={navigateToLogin} />
            <Button title="Register" onPress={navigateToRegist}/>
        </View>
    )
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})