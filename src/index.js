const BinanceWebSocketManager = require('./connection/binance_websocket_manager');
const botConfig = require('../bot_conf.json');
const config = require('../conf.json');

const ws = new BinanceWebSocketManager(
  config.binanceWebSocketUrl,
  botConfig.symbols,
  botConfig.interval,
  botConfig.strategy,
);

ws.start();
