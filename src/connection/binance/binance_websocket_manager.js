const WebSocket = require('ws');
const BinanceWebSocket = require('./binance_websocket');
const ClosesBuffer = require('../../model/closes_buffer');
const CandleEvent = require('../../model/candle_event');
const { binanceWSException } = require('../../exceptions/exceptions');

module.exports = class BinanceWebSocketManager {
  constructor(symbols, interval, strategyConfig) {
    this.strategy = require(`../../strategies/${strategyConfig.name}`);

    this.symbols = symbols;
    this.interval = interval;
    this.strategyConfig = strategyConfig;

    this.binanceWS = null;
    this.closesBuffer = null;
  }

  start() {
    this.binanceWS = new BinanceWebSocket(this.symbols, this.interval);
    this.closesBuffer = new ClosesBuffer(this.symbols);

    this.binanceWS.onopen = this.onOpen();
    this.binanceWS.onmessage = event => this.onMessage(event);
    this.binanceWS.onerror = event => this.onError(event);
    this.binanceWS.onclose = event => this.onClose(event);
  }

  stop() {
    this.binanceWS.close();
  }

  isRunning() {
    const executingStatus = [WebSocket.OPEN, WebSocket.CONNECTING, WebSocket.CLOSING];
    return executingStatus.includes(this.binanceWS.readyState);
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
    throw binanceWSException(`Error event: ${event.data}`);
  }

  onClose(event) {
    console.log('Closing connection with binance websocket...');
  }
};
