module.exports = class CandleEvent {
  constructor(messageData) {
    const message = JSON.parse(messageData.data);
    const candlestick = message.data.k;

    this.isCandleClosed = candlestick.x;
    this.symbol = candlestick.s.toLowerCase();
    this.closePrice = candlestick.c;
  }
};
