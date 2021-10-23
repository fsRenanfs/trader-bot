const BinanceWebSocket = require('./binance_websocket');
const ClosesBuffer = require('../model/closes_buffer');
const CandleEvent = require('../model/candle_event');

module.exports = class BinanceWebSocketManager {
  constructor(url, symbols, interval, strategyConfig) {
    this.strategy = require(`../strategies/${strategyConfig.name}`);

    this.url = url;
    this.symbols = symbols;
    this.interval = interval;
    this.strategyConfig = strategyConfig;

    this.binanceWS = null;
    this.closesBuffer = null;
  }

  start() {
    this.binanceWS = new BinanceWebSocket(this.url, this.symbols, this.interval);
    this.closesBuffer = new ClosesBuffer(this.symbols);

    this.binanceWS.onopen = this.onOpen();
    this.binanceWS.onmessage = event => this.onMessage(event);
    this.binanceWS.onerror = event => this.onError(event);
    this.binanceWS.onclose = this.onClose();
  }

  onOpen() {
    console.log('Initializing connection with binance websocket...');
  }

  onMessage(event) {
    const candleEvent = new CandleEvent(event);

    if (candleEvent.isCandleClosed) {
      const candleSymbol = candleEvent.symbol.toUpperCase();
      this.closesBuffer.push(candleSymbol, candleEvent.closePrice);

      this.strategy(candleSymbol, this.closesBuffer, this.strategyConfig);
    }
  }

  onError(event) {
    console.log(event.data); //colocar exception classe exceptions
  }

  onClose() {}
};
