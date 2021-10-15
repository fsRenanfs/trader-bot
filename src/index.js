const BinanceWebSocket = require('./connection/binance_websocket');
const CandleEvent = require('./model/candle_event');
const botConfig = require('../bot_conf.json');
const config = require('../conf.json');
const { RSI } = require('./utils/indicators');

const ws = new BinanceWebSocket(
  config.binanceWebSocketUrl,
  botConfig.symbols,
  botConfig.rsi.interval,
);

const symbolCloses = new Map();
botConfig.symbols.forEach(symbol => symbolCloses.set(symbol, []));

ws.onopen = () => {
  console.log('Initializing connection with binance websocket...');
};

ws.onmessage = event => {
  const candleEvent = new CandleEvent(event);

  if (candleEvent.isCandleClosed) {
    const closes = symbolCloses.get(candleEvent.symbol);
    closes.push(parseFloat(candleEvent.closePrice));
    symbolCloses.set(candleEvent.symbol, closes);

    console.log(symbolCloses);

    if (closes.length > botConfig.rsi.period) {
      console.log('Calculating RSI...');
      const rsi = RSI(closes, botConfig.rsi.period);
      console.log(
        `${candleEvent.symbol} rsi - ${botConfig.rsi.period}  ${botConfig.rsi.interval}: ${rsi}`,
      );
    }
  }
};

ws.onclose = () => {
  console.log('connection closed...');
};
