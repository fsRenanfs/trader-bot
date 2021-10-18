const BinanceApi = require('./connection/binance_api');
const BinanceWebSocket = require('./connection/binance_websocket');
const CandleEvent = require('./model/candle_event');
const ClosesBuffer = require('./model/closes_buffer');
const botConfig = require('../bot_conf.json');
const config = require('../conf.json');
const { RSI } = require('./utils/indicators');

const ws = new BinanceWebSocket(
  config.binanceWebSocketUrl,
  botConfig.symbols,
  botConfig.rsi.interval,
);

const closesBuffer = new ClosesBuffer(botConfig.symbols);

ws.onopen = () => {
  console.log('Initializing connection with binance websocket...');
};

ws.onmessage = event => {
  const candleEvent = new CandleEvent(event);

  if (candleEvent.isCandleClosed) {
    closesBuffer.push(candleEvent.symbol, candleEvent.closePrice);

    console.log(closesBuffer.get(candleEvent.symbol));

    if (closesBuffer.length(candleEvent.symbol) > botConfig.rsi.period) {
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
