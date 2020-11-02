import React, { Component } from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator()

import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native'

import Parse from '../../config/api'
import Ranking from '../ranking/ranking'
import Configuration from '../configuracao/configuracao'

export default class Playgame extends Component {

    render() {
        return (
            <Tab.Navigator initialRouteName="Game" screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Game') {
                        iconName = focused
                            ? 'ios-home'
                            : 'ios-home';
                    } else if (route.name === 'Ranking') {
                        iconName = focused ? 'ios-trophy' : 'ios-trophy';
                    } else if (route.name === 'Configuration') {
                        iconName = focused ? 'ios-list-box' : 'ios-list';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
                tabBarOptions={{
                    activeTintColor: 'green',
                    inactiveTintColor: 'black',
                }}>
                <Tab.Screen name="Game" component={Game} />
                <Tab.Screen name="Ranking" component={Ranking} />
                <Tab.Screen name="Configuration" component={Configuration} />
            </Tab.Navigator>
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
        numberThePlay: 0,
        idUserName: null
    }

    // lista com perguntas para o jogo

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

    // Componente de inicialização da tela

    async componentDidMount() {
        const user = await AsyncStorage.getItem('@UserApi:user')
        const playday = await AsyncStorage.getItem('@UserApi:playday')
        const email = await AsyncStorage.getItem('@UserApi:email')
        const idUser = await AsyncStorage.getItem('@UserApi:idUser')
        let money = await AsyncStorage.getItem('@UserApi:money')
        if (!!user && !!playday && !!money && !!email) {
            money = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            this.setState({ email: email })
            this.setState({ userLog: user })
            this.setState({ money: money })
            this.setState({ idUserName: idUser })
            if (playday === 'true') {
                this.setState({ playday: true })
            } else if(playday === 'false'){
                this.setState({ playday: false })
            }
        }
        this.getDateToPlay()
        this.setArrayQuest()
    }
    
    // Função que verifica se a uma lista de perguntas, se tiver seta no state, se não cria uma e seta
    // no Storage e no state, e coloca o numero de perguntas que faltam no state
    
    setArrayQuest = async () => {
        if(!this.state.playday) {
            this.setState({ idArrayquest: [] })
        } else if (this.state.playday) {
            const listTrueShuffle = JSON.parse(await AsyncStorage.getItem('@UserApi:idArray'))
            const listShuffle = this.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            if(listTrueShuffle === null) {
                await AsyncStorage.multiSet([
                    ['@UserApi:idArray', JSON.stringify(listShuffle)]
                ])
                this.setState({ idArrayquest: listShuffle })
                this.setStorageFunction()
            } else {
                if(listTrueShuffle.length > 0) {
                    this.setState({ idArrayquest: listTrueShuffle })
                } else if(listTrueShuffle.length == 0) {
                    await AsyncStorage.multiSet([
                        ['@UserApi:idArray', JSON.stringify(listShuffle)]
                    ])
                    this.setState({ idArrayquest: listShuffle })
                }
            }
        }
        this.setState({ numberThePlay: this.state.idArrayquest.length })
    }

    // Gera um numero aleratorio para as porcentagens

    randintNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    selectRandintQuests = (index) => {
        let numberResponseQuest = new Array()
        if(index === 0) {
            numberResponseQuest[0] = this.randintNumber(-60, 30)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-80, 80)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "A Bolsa de valores subiu"
            } else {
                numberResponseQuest[1] = "A Bolsa de valores desceu"
            }
            return numberResponseQuest
        } else if(index === 1) {
            numberResponseQuest[0] = this.randintNumber(-30, 60)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-30, 60)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "A Empresa Alimenticia Subiu"
            } else {
                numberResponseQuest[1] = "A Empresa Alimenticia Desceu"
            }
            return numberResponseQuest
        } else if(index === 2) {
            numberResponseQuest[0] = this.randintNumber(-5, 60)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-5, 60)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "A Magazine recuperou"
            } else {
                numberResponseQuest[1] = "A Magazine perdeu"
            }
            return numberResponseQuest
        }else if(index === 3) {
            numberResponseQuest[0] = this.randintNumber(-50, 50)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-50, 50)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "IRB Brasil ganhou"
            } else {
                numberResponseQuest[1] = "IRB BRasil perdeu"
            }
            return numberResponseQuest
        }else if(index === 4) {
            numberResponseQuest[0] = this.randintNumber(-20, 80)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-20, 80)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "A Aviação subiu"
            } else {
                numberResponseQuest[1] = "A Aviação perdeu"
            }
            return numberResponseQuest
        }else if(index === 5) {
            numberResponseQuest[0] = this.randintNumber(10, 50)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(10, 50)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "O varejo subiu"
            } else {
                numberResponseQuest[1] = "O varejo perdeu"
            }
            return numberResponseQuest
        }else if(index === 6) {
            numberResponseQuest[0] = this.randintNumber(-80, 80)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-80, 80)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "A imobiliaria subiu"
            } else {
                numberResponseQuest[1] = " A imobiliaria desceu"
            }
            return numberResponseQuest
        }else if(index === 7) {
            numberResponseQuest[0] = this.randintNumber(-5, 70)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-5, 70)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "Ecorodovias subiu"
            } else {
                numberResponseQuest[1] = "Ecorodovias desceu"
            }
            return numberResponseQuest
        }else if(index === 8) {
            numberResponseQuest[0] = this.randintNumber(-40, 40)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-40, 40)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "AES Tiete subiu"
            } else {
                numberResponseQuest[1] = "AES Tiete desceu"
            }
            return numberResponseQuest
        }else if(index === 9) {
            numberResponseQuest[0] =  this.randintNumber(-20, 50)
            while(numberResponseQuest[0] == 0) {
                numberResponseQuest[0] = this.randintNumber(-20, 50)
                if(numberResponseQuest[0] != 0) {
                    break
                }
            }
            if(numberResponseQuest[0] > 0) {
                numberResponseQuest[1] = "A crise mundial fez subir"
            } else {
                numberResponseQuest[1] = "A crise mundial fez cair"
            }
            return numberResponseQuest
        }
    }

    // Função que se for passado um valor pega esse valor e seta no Storage e salva no backend o novo valor.

    setStorageFunction = async (value) => {
        if (value) {
            await AsyncStorage.multiSet([
                ['@UserApi:money', JSON.stringify(value)]
            ])
            const User = new Parse.User();
            const query = new Parse.Query(User);

            query.get(this.state.idUserName).then((user) => {
                user.set('playday', this.state.playday);
                user.set('money', value.toString());
                user.save().then((response) => {
                    return
                }).catch((error) => {
                    console.error(error.message);
                });
            });
        } else {
            const User = new Parse.User();
            const query = new Parse.Query(User);

            query.get(this.state.idUserName).then((user) => {
                user.set('playday', this.state.playday);
                user.set('idArray', this.state.idArrayquest);
                user.save().then((response) => {
                    return
                }).catch((error) => {
                    console.error(error.message);
                });
            });
        }
    }

    // Pega numero aleartorio faz calculos em cima do valor da conta do jogador, seta no state, manda
    // para o backend as informações converte para numero com . e passa informações se o usuario 
    // ganhou dinheiro ou perdeu

    insertPorcent = async (value, account) => {
        let porcentRandom = this.selectRandintQuests(this.state.idArrayquest[this.state.idQuests])
        porcentRandom[0] = porcentRandom[0] / 100
        const valueMoney = porcentRandom[0] * value
        let valueMoneyFinalAccount = account + (valueMoney + value)
        valueMoneyFinalAccount = parseInt(valueMoneyFinalAccount)
        this.setState({ moneyInteger: valueMoneyFinalAccount })
        this.setStorageFunction(valueMoneyFinalAccount)
        valueMoneyFinalAccount = valueMoneyFinalAccount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        this.setState({ money: valueMoneyFinalAccount })
        this.nextQuest(porcentRandom)
        this.setButtonQuest()
    }

    // pega o valor do state transforma em numero calculavel, e chama a função a cima com valor da
    // porcentagem passada pelo usuario.

    extractionPorcent = () => {
        let money = this.state.money
        money = money.replace(/[^\d]+/g, '')
        const porcent = this.state.porcentUser / 100
        const porcentAccount = porcent * money
        let porcentAccountFinal = money - porcentAccount
        porcentAccountFinal = porcentAccountFinal.toString()
        porcentAccountFinal = parseInt(porcentAccountFinal)
        this.insertPorcent(porcentAccount, porcentAccountFinal)
    }

    // embaralha um array para perguntas aleartorias a cada dia jogado.

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

    // retorna um array com o dia que o jogador ainda tem para jogar novamente, e outro itens que e
    // as horas e minutos que o jogador precisa esperar para jogar

    verificDateToPlay = (dateBackend) => {
        const nowDateDay = new Date(this.setDate())
        const dateLastPlay = new Date(dateBackend)
        const diffMs = nowDateDay - dateLastPlay
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
        const diff = (23 - diffHrs) + 'h ' + (60 - diffMins) + 'm';
        const diferenca = Math.abs(dateLastPlay.getTime() - nowDateDay.getTime())
        const days = Math.ceil(diferenca / (1000 * 3600 * 24))
        const valor = new Array()
        valor[0] = days
        valor[1] = diff
        return valor
    }

    // função que manda para backend a hora que o jogador terminou as jogadas diarias.

    setDateBackend = () => {
        const User = new Parse.User();
        const query = new Parse.Query(User);

        query.get(this.state.idUserName).then((user) => {
            user.set('datelastplay', this.setDate());
            user.save().then((response) => {
                return
            }).catch((error) => {
                console.error(error.message);
            });
        });
    }

    // Pega no backend o horario que o jogador terminou sua ultima jogada, faz verificação se o jogador
    // pode jogar ou não, se pode jogar entao cria uma nova lista, seta uma lista no backend caso o
    // jogador precise deslogar e logar novamente, ou mostra quantas horas o jogador ainda tem que esperar.

    getDateToPlay = () => {
        if (!this.state.playday) {
            const Person = Parse.Object.extend("User");
            const query = new Parse.Query(Person);

            query.get(this.state.idUserName)
                .then(async (person) => {
                    const idArray = person.get("datelastplay");
                    const days = this.verificDateToPlay(idArray)
                    if (days[0] > 1) {
                        this.setState({ playday: true })
                        this.setArrayQuest()
                        this.setStorageFunction()
                    } else if (days[0] <= 1) {
                        Alert.alert('Você ainda tem ' + days[1] + ' para jogar')
                    }
                }, (error) => {
                    alert(error.message);
                });
        }
    }

    // Pega a data atual e transforma em toISO

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

    // adiciona um "0" para minutos/horas sem zero a esquerda

    addzero = (i) => {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }

    // função que remove um indice da lista de questões, seta nova lista no Storage,e seta no backend
    // e diminuiu as perguntas do usuario, verifica se o usuario perdeu dinheiro ou ganhou nos investimentos.

    nextQuest = async (direction) => {
        if (direction[0] === undefined) {
            const porcentRandom = this.selectRandintQuests(this.state.idArrayquest[this.state.idQuests])
            Alert.alert('Vocẽ recusou e ' + porcentRandom[1] + porcentRandom[0] + '%')
        }
        if (this.state.idArrayquest.length === 1) {
            this.setDateBackend()
            this.setState({ playday: false })
            await AsyncStorage.multiSet([
                ['@UserApi:playday', JSON.stringify(false)]
            ])
        }
        if (this.state.idArrayquest.length === 0) {
            return Alert.alert('Vocẽ não tem mais perguntas hoje, volte amanhã !!')
        }
        this.state.idArrayquest.splice(0, 1)
        await AsyncStorage.multiSet([
            ['@UserApi:idArray', JSON.stringify(this.state.idArrayquest)]
        ])
        this.setStorageFunction()
        this.setState({ numberThePlay: this.state.numberThePlay - 1 })
        if (this.state.idQuests >= this.state.idArrayquest.length - 1) {
            this.setState({ idQuests: 0 })
        } else {
            this.setState({ idQuests: 0 })
        }
        if(direction[0]) {
            Alert.alert(direction[1] + parseInt(direction[0] * 100) + '% das ações')
        }
    }

    // Esconde e mostra botões para usuario

    setButtonQuest = () => {
        if (this.state.buttonOnOff) {
            this.setState({ buttonOnOff: false })
        } else {
            this.setState({ buttonOnOff: true })
        }
    }

    chooseAddPorcentage = () => {
        if (this.state.porcentUser === 100) {
            return
        }
        this.setState({ porcentUser: this.state.porcentUser + 10 })
    }

    chooseDiminPorcentage = () => {
        if (this.state.porcentUser === 0) {
            return
        }
        this.setState({ porcentUser: this.state.porcentUser - 10 })
    }

    render() {
        return (
            <ScrollView style={styles.home}>
                <View style={styles.homeInfos}>
                    {!!this.state.userLog && <Text style={styles.viewHeader}>{this.state.userLog}</Text>}
                    {!!this.state.money && <Text style={styles.viewHeader}>{this.state.money},00 R$</Text>}
                </View>
                <View style={styles.questStyle}>
                    <Text>Você tem {this.state.numberThePlay} perguntas !!</Text>
                    <Text style={{ fontSize: 20, margin: 10 }}>{this.quests[this.state.idArrayquest[this.state.idQuests]]}</Text>
                   {this.state.playday === true &&  <View style={styles.questStyleButton}>
                        <View style={styles.chooseToView}>
                            {!!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.chooseDiminPorcentage}>
                                <Text style={styles.textButton}>-</Text>
                            </TouchableOpacity>}
                            {!!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.extractionPorcent}>
                                <Text style={styles.textButton}>{this.state.porcentUser}%</Text>
                            </TouchableOpacity>}
                            {!!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.chooseAddPorcentage}>
                                <Text style={styles.textButton}>+</Text>
                            </TouchableOpacity>}
                        </View>
                        <View style={styles.ButtonToChoose}>
                            {!!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.setButtonQuest}>
                                <Text style={styles.textButton}>Voltar</Text>
                            </TouchableOpacity>}
                            {!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.setButtonQuest}>
                                <Text style={styles.textButton}>Sim</Text>
                            </TouchableOpacity>}
                            {!this.state.buttonOnOff && <TouchableOpacity style={styles.button} onPress={this.nextQuest}>
                                <Text style={styles.textButton}>Não</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    home: {
        // justifyContent: 'center',
        // alignItems: 'center',
        height: '100%'
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
        // height: 400,
        justifyContent: 'center',
        alignItems: 'center'
    },
    questStyleButton: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
    chooseToView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center'
    },
    ButtonToChoose: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }
})