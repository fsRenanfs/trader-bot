const Binance = require('binance-api-node').default;

module.exports = class BinanceApi {
  constructor(apikey, apiSecret) {
    this.binance = Binance({
      APIKEY: apikey,
      APISECRET: apiSecret,
    });
  }

  async buy(symbol) {
    const prices = await this.binance.prices({ symbol: symbol });
    console.log(prices);
  }

  async sell() {}

  async orders() {
    const orders = await this.binance.allOrders();
  }
};
