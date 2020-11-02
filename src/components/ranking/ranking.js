import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'

import Parse from '../../config/api'

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

    compare = (a,b) => {
        if (a.money < b.money)
           return -1;
        if (a.money > b.money)
          return 1;
        return 0;
      }

    async componentDidMount() {
        var Person = Parse.Object.extend("User");
        var query = new Parse.Query(Person);

        query.select('username', 'money')
        query.find()
            .then((person) => {
                let lista = []
                for(let i = 0; person.length > i; i++ ) {
                    let listaFor = {}
                    const user = person[i].get("username")
                    const money = person[i].get("money")
                    listaFor.user = user
                    listaFor.money = Number(money)
                    lista.push(listaFor)
                }
                lista.sort(this.compare).reverse()
                for(let i = 0; lista.length > i; i++) {
                    lista[i].money = lista[i].money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ',00'
                }
                this.setState({ users: lista })
                this.setState({ player1: this.state.users[0]})
                this.setState({ player2: this.state.users[1]})
                this.setState({ player3: this.state.users[2]})
                this.setState({ player4: this.state.users[3]})
            }, (error) => {
                alert(error.message);
            });
        setTimeout(() => {
            this.componentDidMount()
        }, 10000)
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.body}>
                    <Text>Ranking</Text>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>1 Lugar</Text>
                        {this.state.player1 && <Text style={styles.textUser}>{this.state.player1.user}</Text>}
                        {this.state.player1 && <Text style={styles.textUser}>{this.state.player1.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>2 Lugar</Text>
                        {this.state.player2 && <Text style={styles.textUser}>{this.state.player2.user}</Text>}
                        {this.state.player2 && <Text style={styles.textUser}>{this.state.player2.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>3 Lugar</Text>
                        {this.state.player3 && <Text style={styles.textUser}>{this.state.player3.user}</Text>}
                        {this.state.player3 && <Text style={styles.textUser}>{this.state.player3.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>4 Lugar</Text>
                        {this.state.player4 && <Text style={styles.textUser}>{this.state.player4.user}</Text>}
                        {this.state.player4 && <Text style={styles.textUser}>{this.state.player4.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>5 Lugar</Text>
                        {this.state.player5 && <Text style={styles.textUser}>{this.state.player5.user}</Text>}
                        {this.state.player5 && <Text style={styles.textUser}>{this.state.player5.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>6 Lugar</Text>
                        {this.state.player6 && <Text style={styles.textUser}>{this.state.player6.user}</Text>}
                        {this.state.player6 && <Text style={styles.textUser}>{this.state.player6.money}</Text>}
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
    textUser: {
        fontSize: 20
    }
})