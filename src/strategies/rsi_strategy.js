const { RSI } = require('./indicators');

//deve ter apenas um metodo
module.exports = (symbol, closesBuffer, rsiConfig) => {
  if (closesBuffer.length(symbol) > rsiConfig.period) {
    console.log('Calculating RSI...');

    const closes = closesBuffer.get(symbol);
    const rsi = RSI(closes, rsiConfig.period);

    console.log(`${symbol} rsi - ${rsiConfig.period}  ${rsiConfig.interval}: ${rsi}`);

    if (rsi < rsiConfig.smallerThan) {
      console.log('** BUY');
    }
  }
};
