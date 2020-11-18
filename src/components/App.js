import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, Text, View, Image } from 'react-native';

import Home from '../components/home/home'
import { create } from 'apisauce'
import Playgame from '../components/playgame/playgame';

const api = create({
    baseURL: "https://time.is"
})

export default class App extends Component {

    state = {
        user: null,
    }

    async componentDidMount() {
        this.verificDateIsTrue()
    }

    verificDateIsTrue = async () => {
        const response = await api.get()
        const itens = response.headers.expires.split(' ')
        const internetDate = new Date(`${itens[1]} ${itens[2]} ${itens[3]} ${itens[4]} -0`)
        const nowDateDay = new Date(this.setDate())
        let minuteInternet = internetDate.getUTCMinutes()
        const minuteLocal = nowDateDay.getUTCMinutes()
        if (minuteInternet === minuteLocal + 1 || minuteInternet === minuteLocal - 1) {
            minuteInternet = minuteLocal
        }
        const hoursMinutesInternet = `${internetDate.getUTCHours()}:${minuteInternet}`
        const dayMonthYearInternet = `${internetDate.getDate()}/${internetDate.getMonth() + 1}/${internetDate.getFullYear()}`
        const hoursMinutesLocal = `${nowDateDay.getUTCHours()}:${minuteLocal}`
        const dayMonthYearLocal = `${nowDateDay.getDate()}/${nowDateDay.getMonth() + 1}/${nowDateDay.getFullYear()}`
        if (hoursMinutesInternet === hoursMinutesLocal && dayMonthYearInternet === dayMonthYearLocal) {
            const user = await AsyncStorage.getItem('@UserApi:user')
            const money = await AsyncStorage.getItem('@UserApi:money')
            if (user && money) {
                this.setState({ user: true })
            } else {
                this.setState({ user: false })
            }
        } else {
            this.setState({ user: 'TimeError' })
        }
    }

    setDate = () => {
        const now = new Date()
        const nowYear = this.addzero(now.getFullYear())
        const nowMonth = this.addzero(now.getMonth() + 1)
        const nowDay = this.addzero(now.getDate())
        const nowHour = this.addzero(now.getHours())
        const nowMinutes = this.addzero(now.getMinutes())
        const nowDate = nowYear + '-' + nowMonth + '-' + nowDay + 'T' + nowHour + ':' + nowMinutes
        const dateAtual = new Date(nowDate)
        return dateAtual
    }

    addzero = (i) => {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }

    render() {
        if (this.state.user === null) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }}><Image source={require('../img/loading2.gif')} style={{ width: 100, height: 100 }} /></View>
            )
        } else if (this.state.user === 'TimeError') {
            return (<TimeIsError />)
        } else if (this.state.user === true) {
            return (<Playgame />)
        }
        else if (this.state.user === false) {
            return (<Home />)
        }
    }
}

class TimeIsError extends Component {

    render() {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                <Image style={{width: 100, height: 100}} source={require('../img/69176.png')}></Image>
                <Text style={{fontSize: 20}}>Horário/Data estão errados !!</Text>
            </View>
        )
    }
}