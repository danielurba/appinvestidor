import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import { View, Text, StyleSheet, Alert } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import RNRestart from 'react-native-restart'

import api from '../../config/api'

export default class Playgame extends Component {

    render() {
        return (
            <Stack.Navigator initialRouteName="Game" screenOptions={{ headerStyle: { backgroundColor: '#248f24' }, headerTintColor: '#fff' }}>
                <Stack.Screen name="Game" component={Game} options={{ headerLeft: null }} />
            </Stack.Navigator>
        )
    }
}

class Game extends Component {

    state = {
        userLog: null,
        playday: null,
        money: null,
        moneyInteger: null,
        email: null,
        porcentUser: 0,
        buttonOnOff: false,
        idArrayquest: [],
        idQuests: 0,
        numberThePlay: 0
    }

    quests = [
        "A B3 (Bolsa de Valores) vem subindo exuberantemente, chegando à 52,85% de rendimento. Deseja investir?",
        "Um investidor deseja abrir uma empresa no ramo alimentício de bolos e salgadinhos para festa, ele chamou você para ser seu sócio 50% de cada um. Deseja fazer parte da sociedade?",
        "A Magazine Luiza nas ultimas semanas, a demanda por produtos do comércio eletrônico cresceu pelo mundo todo. Um aumento de 180% no volume de transações no período. Seu papel custa hoje cerca de R$ 60,00 uma valorização de 108%. Na época sua ação era vendida por R$ 28,81. Deseja investir?",
        "IRB Brasil por causa da crise no Brasil, os papéis da resseguradora IRB acumularam uma queda de 70,89% em seu valor. Uma informação falsa de que o megainvestidor Warrem Buffet teria triplicado seu investimento na companhia. Depois disso a resseguradora passou a ser olhada com desconfiança pelo mercado. O que você deseja fazer?",
        "O setor de aviação civil tem sido um dos que mais sofre com a crise econômica que veio com a pandemia. O banimento de voos tem esvaziado e cancelado voos domésticos e internacionais. A Smiles Fidelidade (SMLS3) empresa responsável pelo programa de milhas da GOL tem amargado uma queda de 63,32%. Deseja investir?",
        "Via Varejo (VVAR3) empresa responsável pela administração das marcas Casas Bahia, PontoFrio, e do e-commerce do Extra. Por algum motivo não especifico a companhia teve uma queda de 61,77% no valor de suas ações. Deseja investir?",
        "Uma imobiliária de grande reputação e famosa na sua área, sofreu um grande processo e acabou perdendo na justiça. O que você deseja fazer?",
        "(ECOR3) Ecorodovias tem uma tese positiva do setor é sustentada pelo cronograma robusto de projetos de infraestrutura no Brasil. Com os dados de tráfego apresentando crescimento sequencial, acreditamos que o setor deverá continuar atrativo nos curtos e médios prazos, avaliam os analistas. Deseja investir?",
        "AES Tietê (TIET11) e EDP Energias do Brasil (ENBR3) no setor elétrico, a XP vê um risco de curto prazo de desequilíbrio entre oferta e demanda gerado principalmente pelo baixo volume de chuvas e a dependência do Brasil de fontes hidrelétricas. Nos reservatórios corresponderam apenas a 57% da média histórica, o que pode pressionar os reservatórios no curto prazo caso não haja uma recuperação no período de chuvas. O que deseja fazer?",
        "As preocupações com o crescimento global e o noticiário da guerra comercial entre EUA e China devem seguir no foco dos investidores, que buscam entender as tendências para a demanda por minério de ferro. A continuidade do retorno das operações da Vale (VALE3) pode colocar alguma pressão do lado da oferta enquanto o mercado acompanha potenciais estímulos, como redução dos juros por parte da China, que poderia sustentar a produção de aço. A expectativa é que o minério de ferro volte gradualmente para os níveis de 2018, em torno dos US$ 70 por tonelada. No caso dos preços de aço no Brasil, um dólar mais alto e o melhor cenário para demanda podem compensar eventual queda dos preços internacionais, avaliam, ressaltando que a Vale tem um preço atrativo e boa geração de caixa. Deseja investir na companhia?"
    ]

    async componentDidMount() {
        const user = await AsyncStorage.getItem('@UserApi:user')
        const playday = await AsyncStorage.getItem('@UserApi:playday')
        const email = await AsyncStorage.getItem('@UserApi:email')
        let money = await AsyncStorage.getItem('@UserApi:money')
        if (!!user && !!playday && !!money && !!email) {
            money = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            this.setState({ email: email })
            this.setState({ userLog: user })
            this.setState({ playday: playday })
            this.setState({ money: money })
        }
        this.getDateToPlay()
        const listTrueShuffle = JSON.parse(await AsyncStorage.getItem('@UserApi:idArray'))
        if(listTrueShuffle) {
            this.setState({ idArrayquest: listTrueShuffle })
        } else if(!listTrueShuffle) {
            const listShuffle = this.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            await AsyncStorage.multiSet([
                ['@UserApi:idArray', JSON.stringify(listShuffle) ]
            ])
            this.setState({ idArrayquest: listShuffle })
        }
        this.setState({ numberThePlay: this.state.idArrayquest.length})
    }

    randintNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min +1) + min)
    }

    setStorageFunction = async (value) => {
        if(value) {
            await AsyncStorage.multiSet([
                ['@UserApi:money', JSON.stringify(value)]
            ])
            const infouser = {
                user: this.state.userLog,
                playday: this.state.playday,
                email: this.state.email,
                money: value
            }
            api.post('/savedacc', infouser)
        } else {
            const infouser = {
                user: this.state.userLog,
                playday: this.state.playday,
                email: this.state.email,
                idArray: this.state.idArrayquest
            }
            api.post('/savedacc', infouser)
        }
    }

    insertPorcent = (value, account) => {
        const porcentRandom = this.randintNumber(0, 30) / 100
        const valueMoney = porcentRandom * value
        let valueMoneyFinalAccount = account + (valueMoney + value)
        valueMoneyFinalAccount = parseInt(valueMoneyFinalAccount)
        this.setState({ moneyInteger: valueMoneyFinalAccount})
        this.setStorageFunction(valueMoneyFinalAccount)
        valueMoneyFinalAccount = valueMoneyFinalAccount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        this.setState({ money: valueMoneyFinalAccount })
        if(porcentRandom > 0) {
            this.nextQuest(porcentRandom)
        } else if(porcentRandom < 0) {
            this.nextQuest(porcentRandom)
        } else if(porcentRandom === 0) {
            this.nextQuest(porcentRandom)
        }
        this.setButtonQuest()
    }

    extractionPorcent = () => {
        let money = this.state.money
        money = money.replace(/[^\d]+/g,'')
        const porcent = this.state.porcentUser / 100
        const porcentAccount = porcent * money
        let porcentAccountFinal = money - porcentAccount
        porcentAccountFinal =  porcentAccountFinal.toString()
        porcentAccountFinal = parseInt(porcentAccountFinal)
        this.insertPorcent(porcentAccount, porcentAccountFinal)
    }

    shuffle(array) {
        let m = array.length, t, i;
        while (m) {
          i = Math.floor(Math.random() * m--);
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }
        return array;
      }
    
      verificDateToPlay = (dateBackend) => {
        const nowDateDay = new Date(this.setDate())
        const dateLastPlay = new Date(dateBackend)
        const diferenca = Math.abs(nowDateDay.getTime() - dateLastPlay.getTime())
        const days = Math.ceil(diferenca / (1000 * 3600 * 24))
        return days
    }
    
    setDateBackend = () => {
        const infouser = {
            email: this.state.email,
            date: this.setDate()
        }
        api.post('/savedacc', infouser)
    }

    getDateToPlay = async () => {
        const infouser = {
            email: this.state.email
        }
        const response = await api.post('/getdate', infouser)
        console.log(this.setDate())
        // console.log(this.verificDateToPlay(response.data.date))
    }
    
    setDate = () => {
        const now = new Date()
        const nowYear = now.getFullYear()
        const nowMonth = now.getMonth() +1
        const nowDay = now.getDate()
        const nowHour = now.getHours()
        const nowMinutes = now.getMinutes()
        const nowDate = nowYear + '-' + nowMonth + '-' + nowDay + 'T' + nowHour + ':' + nowMinutes
        const dateAtual = new Date(nowDate)
        console.log(dateAtual)
        return JSON.stringify(dateAtual)
    }

    nextQuest = async (direction) => {
        if(this.state.idArrayquest.length === 1) {
            this.setDateBackend()
            this.setState({ playday: false })
        }
        if(this.state.idArrayquest.length === 0) {
            this.setDateBackend()
            return Alert.alert('Vocẽ não tem mais perguntas hoje, volte amanhã !!')
        }
        const removeQuests = this.state.idArrayquest.splice(0, 1)
        await AsyncStorage.multiSet([
            ['@UserApi:idArray', JSON.stringify(this.state.idArrayquest)]
        ])
        this.setStorageFunction()
        this.setState({ numberThePlay: this.state.numberThePlay -1})
        if(this.state.idQuests >= this.state.idArrayquest.length -1) {
            this.setState({ idQuests: 0})
        } else {
            this.setState({ idQuests: 0})
        }
        if(direction > 0) {
            Alert.alert('Vocẽ recuperou ' + parseInt(direction*100) + '% das ações')
        } else if(direction < 0) {
            Alert.alert('Você perdeu' + parseInt(direction*100) + '% das ações')
        } else if(direction === 0) {
            Alert.alert('Vocẽ não ganhou nada e nem perdeu')
        } else if(direction === undefined) {
            const porcentRandom = this.randintNumber(0, 30)
            Alert.alert('Vocẽ recusou e as ações subiram ' + porcentRandom +'%')
        }
    }

    clearStorage = async () => {
        await AsyncStorage.clear()
        RNRestart.Restart()
    }

    setButtonQuest = () => {
        if(this.state.buttonOnOff) {
            this.setState({ buttonOnOff: false })
        } else {
            this.setState({ buttonOnOff: true })
        }
    }

    render() {
        return (
            <View style={styles.home}>
                <View style={styles.homeInfos}>
                    {!!this.state.userLog && <Text style={styles.viewHeader}>{this.state.userLog}</Text>}
                    {!!this.state.money && <Text style={styles.viewHeader}>{this.state.money},00 R$</Text>}
                </View>
                <View style={styles.questStyle}>
                    <Text>Você tem {this.state.numberThePlay} perguntas !!</Text>
                    <Text style={{ fontSize: 20, margin: 10 }}>{this.quests[this.state.idArrayquest[this.state.idQuests]]}</Text>
                    <View style={styles.questStyleButton}>
                        {!!this.state.buttonOnOff && <TextInput placeholder="Porcentagem..." onChangeText={(text) => this.setState({ porcentUser: text}) }/> }
                        {!!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.extractionPorcent}>
                            <Text style={styles.textButton}>Investir</Text>
                            </TouchableOpacity>}
                        {!!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.setButtonQuest}>
                            <Text style={styles.textButton}>Voltar</Text>
                        </TouchableOpacity>}
                        {!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.setButtonQuest}>
                            <Text style={styles.textButton}>Sim</Text>
                        </TouchableOpacity>}
                        {!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.nextQuest}>
                            <Text style={styles.textButton}>Não</Text>
                        </TouchableOpacity>}
                        <TouchableOpacity style={styles.button} onPress={this.clearStorage}>
                            <Text style={styles.textButton}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    home: {
        // justifyContent: 'center',
        // alignItems: 'center',
        height: 400
    },
    homeInfos: {
        width: '100%',
        height: 40,
        backgroundColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    textHeader: {
        fontSize: 20,
        color: '#fff'
    },
    viewHeader: {
        marginLeft: 30,
        fontSize: 24,
        color: '#fff'
    },
    questStyle: {
        width: '100%',
        height: 400,
        justifyContent: 'center',
        alignItems: 'center'
    },
    questStyleButton: {
        flexDirection: 'row'
    },
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