import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native'
import Ionicons from 'react-native-ionicons'

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
        this.refreshToRanking()
    }

    refreshToRanking = () => {
        const Person = Parse.Object.extend("User");
        const query = new Parse.Query(Person);

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
                this.setState({ player4: this.state.users[4]})
                this.setState({ player4: this.state.users[5]})
            }, (error) => {
                alert(error.message);
            });
    }

    render() {
        return (
            <ImageBackground source={require('../../img/backgroundhome.jpg')} style={{ flex: 1, width: null, height: null}}>
            <ScrollView>
                <View style={styles.body}>
                    <Ionicons name="ios-refresh" size={50} color={'#ffffff'} onPress={this.refreshToRanking} style={{margin: 10}}/>
                    <Text style={styles.textUser}>RANKING</Text>
                    <View style={styles.boxPosition}>
                        <Ionicons name="ios-trophy" size={30} color={'#ffff00'}/>
                        <Text style={styles.textPosicion}>Top 1</Text>
                        {this.state.player1 && <Text style={styles.textUser}>{this.state.player1.user}</Text>}
                        {this.state.player1 && <Text style={styles.textUser}>{this.state.player1.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                    <Ionicons name="ios-trophy" size={30} color={'#c0c0c0'}/>
                        <Text style={styles.textPosicion}>Top 2</Text>
                        {this.state.player2 && <Text style={styles.textUser}>{this.state.player2.user}</Text>}
                        {this.state.player2 && <Text style={styles.textUser}>{this.state.player2.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                    <Ionicons name="ios-trophy" size={30} color={'#cd7f32'}/>
                        <Text style={styles.textPosicion}>Top 3</Text>
                        {this.state.player3 && <Text style={styles.textUser}>{this.state.player3.user}</Text>}
                        {this.state.player3 && <Text style={styles.textUser}>{this.state.player3.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>Top 4</Text>
                        {this.state.player4 && <Text style={styles.textUser}>{this.state.player4.user}</Text>}
                        {this.state.player4 && <Text style={styles.textUser}>{this.state.player4.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>Top 5</Text>
                        {this.state.player5 && <Text style={styles.textUser}>{this.state.player5.user}</Text>}
                        {this.state.player5 && <Text style={styles.textUser}>{this.state.player5.money}</Text>}
                    </View>
                    <View style={styles.boxPosition}>
                        <Text style={styles.textPosicion}>Top 6</Text>
                        {this.state.player6 && <Text style={styles.textUser}>{this.state.player6.user}</Text>}
                        {this.state.player6 && <Text style={styles.textUser}>{this.state.player6.money}</Text>}
                    </View>
                </View>
            </ScrollView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginTop: 25
    },
    boxPosition: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 200,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        marginTop: 20
    },
    textPosicion: {
        fontSize: 20,
        margin: 20,
        color: '#fff'
    },
    textUser: {
        fontSize: 20,
        color: '#fff'
    }
})