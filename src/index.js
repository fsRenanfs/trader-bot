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
//New bot voa
const closesBuffer = new ClosesBuffer(botConfig.symbols);

ws.onopen = () => {
  console.log('Initializing connection with binance websocket...');
};

ws.onmessage = event => {
  const candleEvent = new CandleEvent(event);

  if (candleEvent.isCandleClosed) {
    const candleSymbol = candleEvent.symbol.toUpperCase();
    closesBuffer.push(candleSymbol, candleEvent.closePrice);

    console.log(`${candleSymbol}: ${closesBuffer.get(candleSymbol)}`);

    if (closesBuffer.length(candleSymbol) > botConfig.rsi.period) {
      console.log('Calculating RSI...');
      const closes = closesBuffer.get(candleSymbol);
      const rsi = RSI(closes, botConfig.rsi.period);

      console.log(
        `${candleSymbol} rsi - ${botConfig.rsi.period}  ${botConfig.rsi.interval}: ${rsi}`,
      );

      if (rsi < botConfig.rsi.oversold) {
        //BUY
      }
    }
  }
};

ws.onclose = () => {
  console.log('connection closed...');
};
