const talib = require('talib');
const BinanceWebSocket = require('./connection/binance_websocket')
const botConfig = require('../bot_conf.json')
const config = require('../conf.json')

//Validar config symbols, devem ser minusculos os pares
//--
const ws = new BinanceWebSocket(config.binanceWebSocketUrl, botConfig.symbols, botConfig.rsi.interval)

const symbolCloses = new Map()
botConfig.symbols.forEach(symbol => symbolCloses.set(symbol, []))

ws.onopen = () => {
    console.log('Initializing connection with binance websocket...')
}

ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    const candlestick = message.data.k
    const isCandleClosed = candlestick.x

    if(isCandleClosed){        
        const symbol = candlestick.s.toLowerCase()
        const closePrice = candlestick.c

        const closes = symbolCloses.get(symbol)
        closes.push(parseFloat(closePrice))
        symbolCloses.set(symbol, closes)

        console.log(symbolCloses)
        console.log(closes.lenght)

        if(closes.lenght > botConfig.rsi.period){
            const rsi = talib.RSI(closes, botConfig.rsi.period)
            console.log(`${symbol} rsi - ${botConfig.rsi.period}  ${botConfig.rsi.interval}: ${rsi}`)
        }
    }
    
}

ws.onclose = () => {
    console.log('connection closed...')
}