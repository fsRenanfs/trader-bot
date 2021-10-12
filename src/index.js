const Candlestick = require('./model/candlestick')
const BinanceWebSocket = require('./connection/binance_websocket')

//Configuration
const URL = 'wss://stream.binance.com:9443'

const candlesticks = []
candlesticks.push(new Candlestick('ethusdt', '1m'))
candlesticks.push(new Candlestick('btcusdt', '1m'))
candlesticks.push(new Candlestick('adausdt', '1m'))

const ws = new BinanceWebSocket(URL, candlesticks)

//------

ws.onopen = () => {

}

ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log(message.stream)
}

ws.onclose = () => {

}