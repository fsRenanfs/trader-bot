const Candlestick = require('./candlestick')

module.exports = class CandlestickEvent extends Candlestick {
    constructor(symbol, interval, closePrice) {
        super(symbol, interval)
        this.closePrice = closePrice
    }
}