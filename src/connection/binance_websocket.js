const WebSocket = require('ws')

module.exports = class BinanceWebSocket {
    
    constructor(url, symbols, interval) {
        const formattedURL = this.getFormattedURL(url, symbols, interval)
        return new WebSocket(formattedURL)
    }

    getFormattedURL(url, symbols, interval) {
        url += '/stream?streams='
        symbols.forEach(symbol => {
            url += `${symbol}@kline_${interval}/` 
        });
        return url.slice(0, -1)
    }
}