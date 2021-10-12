const WebSocket = require('ws')

module.exports = class BinanceWebSocket {
    
    constructor(url, candlesticks) {
        const formattedURL = this.getFormattedURL(url, candlesticks)
        return new WebSocket(formattedURL)
    }

    getFormattedURL(url, candlesticks) {
        url += '/stream?streams='
        candlesticks.forEach(candlestick => {
            url += `${candlestick.symbol}@kline_${candlestick.interval}/` 
        });
        return url.slice(0, -1)
    }
}