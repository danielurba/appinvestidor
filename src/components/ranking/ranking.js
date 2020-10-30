import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'

import api from '../../config/api'

export default class Ranking extends Component {

    state = {
        users: {},
        player1: [],
        player2: [],
        player3: [],
        player4: [],
        player5: [],
        player6: []
    }

    async componentDidMount() {
        const response = await api.get('/get')
        if(response.problem === "NETWORK_ERROR") {
            return Alert.alert('Sem internet os usuários não podem ser mostrados !!')
        }
        let lista = []
        const list = response.data
        for(let i = 0; list.length > i; i++) {
            let listUserMoney = []
            listUserMoney.push(list[i]["money"].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ',00')
            listUserMoney.push(list[i]["user"])
            lista.push(listUserMoney)
        }
        this.setState({ users: lista.sort().reverse() })
        this.setState({ player1: this.state.users[0]})
        this.setState({ player2: this.state.users[1]})
        this.setState({ player3: this.state.users[2]})
        this.setState({ player4: this.state.users[3]})
        setTimeout(() => {
            this.componentDidMount()
        }, 10000)
    }

    render() {
        return(
            <ScrollView>
            <View style={styles.body}>
                <Text>Ranking</Text>
                <View style={styles.boxPosition}>
                    <Text style={styles.textPosicion}>1 Lugar</Text>
                    {this.state.player1 && <Text style={styles.textUser}>{this.state.player1[1]}</Text>}
                    {this.state.player1 && <Text style={styles.textUser}>{this.state.player1[0]}</Text> }
                </View>
                <View style={styles.boxPosition}>
                    <Text style={styles.textPosicion}>2 Lugar</Text>
                    {this.state.player2 && <Text style={styles.textUser}>{this.state.player2[1]}</Text>}
                    {this.state.player2 && <Text style={styles.textUser}>{this.state.player2[0]}</Text>}
                </View>
                <View style={styles.boxPosition}>
                    <Text style={styles.textPosicion}>3 Lugar</Text>
                    {this.state.player3 && <Text style={styles.textUser}>{this.state.player3[1]}</Text>}
                    {this.state.player3 && <Text style={styles.textUser}>{this.state.player3[0]}</Text>}
                </View>
                <View style={styles.boxPosition}>
                    <Text style={styles.textPosicion}>4 Lugar</Text>
                    {this.state.player4 && <Text style={styles.textUser}>{this.state.player4[1]}</Text>}
                    {this.state.player4 && <Text style={styles.textUser}>{this.state.player4[0]}</Text>}
                </View>
                <View style={styles.boxPosition}>
                    <Text style={styles.textPosicion}>5 Lugar</Text>
                    {this.state.player5 && <Text style={styles.textUser}>{this.state.player5[1]}</Text>}
                    {this.state.player5 && <Text style={styles.textUser}>{this.state.player5[0]}</Text>}
                </View>
                <View style={styles.boxPosition}>
                    <Text style={styles.textPosicion}>6 Lugar</Text>
                    {this.state.player6 && <Text style={styles.textUser}>{this.state.player6[1]}</Text>}
                    {this.state.player6 && <Text style={styles.textUser}>{this.state.player6[0]}</Text>}
                </View>
            </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    boxPosition: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        width: 300,
        height: 300,
        borderWidth: 1
    },
    textPosicion: {
        fontSize: 20,
        margin: 20
    }, 
    textUser : {
        fontSize: 20
    }
})