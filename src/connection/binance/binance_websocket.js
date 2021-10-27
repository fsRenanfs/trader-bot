require('dotenv').config();
const WebSocket = require('ws');

module.exports = class BinanceWebSocket {
  constructor(symbols, interval) {
    const formattedURL = this.getFormattedURL(process.env.BINANCE_WS_URL, symbols, interval);
    return new WebSocket(formattedURL);
  }

  getFormattedURL(url, symbols, interval) {
    url += '/stream?streams=';
    symbols.forEach(symbol => {
      url += `${symbol.toLowerCase()}@kline_${interval}/`;
    });
    return url.slice(0, -1);
  }
};
