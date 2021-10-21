module.exports = class Orders {
  constructor(exchangeInfo) {
    const symbolInfo = exchangeInfo.symbols
      .filter(symbolInfo => symbolInfo.symbol === symbol)
      .shift();

    // this.symbol = symbolInfo
    // this.lotSizeMaxQty =
    // this.lotSizeMinQty =
    // this.maxOrders =
  }
};
