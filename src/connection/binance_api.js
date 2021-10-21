const BinanceClient = require('binance-api-node').default;
const calculator = require('../utils/calculator');
const { binanceApiException } = require('../exceptions/exceptions');
const { binanceApiUtils } = require('../utils/constants');

module.exports = class BinanceApi {
  constructor(apikey, apiSecret) {
    this.binance = BinanceClient({
      apiKey: apikey,
      apiSecret: apiSecret,
    });
  }

  async marketOrder(symbol, side, quantity) {
    try {
      console.log(side);
      const order = await this.binance.order({
        symbol: symbol,
        side: side,
        quantity: quantity,
        type: binanceApiUtils.MARKET_TYPE,
      });

      return order;
    } catch (e) {
      console.log(e);
    }

    return null;
  }

  async buy(symbol, usdt) {
    const prices = await this.binance.prices({ symbol: symbol });
    const quotePrecision = await this.quotePrecision(symbol);

    const currentPrice = prices[symbol];
    const quantity = calculator.currencyQuantity(usdt, currentPrice);
    const formattedQuantity = calculator.roundFloor(quantity, quotePrecision);
    //validar valor minimo permitido + 1 dol para garantir q tera uma brecha
    console.log(`$$ ORDER: Buy ${formattedQuantity} of ${symbol} (${usdt} USDT)`);

    const order = await this.marketOrder(symbol, binanceApiUtils.BUY, formattedQuantity);

    console.log(`$$ ORDER COMPLETED`);
    console.log(order);
  }

  async sell(symbol, quantity) {
    const order = await this.marketOrder(symbol, binanceApiUtils.SELL, quantity);
  }

  async allOrders(symbol) {
    return await this.binance.allOrders({ symbol: symbol });
  }

  async openOrders(symbol) {
    return await this.binance.openOrders({ symbol: symbol });
  }

  async exchangeInfo() {
    return await this.binance.exchangeInfo();
  }

  async symbolInfo(symbol) {
    const exchangeInfo = await this.exchangeInfo();
    const symbolInfo = exchangeInfo.symbols
      .filter(symbolInfo => symbolInfo.symbol === symbol)
      .shift();

    if (symbolInfo == null)
      throw binanceApiException(`Symbol ${symbol} not found in exchangeInfo response.`);

    return symbolInfo;
  }

  async symbolFilter(symbol, filterType) {
    const symbolInfo = await this.symbolInfo(symbol);
    const filter = symbolInfo.filters.filter(filter => filter.filterType === filterType).shift();

    if (filter == null)
      throw binanceApiException(`${filterType} ${symbol} not found in symbol Info.`);

    return filter;
  }

  async minimumPrice(symbol) {
    const minimumPriceData = await this.symbolFilter(symbol, binanceApiUtils.MIN_NOTIONAL_FILTER);

    if (!minimumPriceData.applyToMarket)
      throw binanceApiException(
        `Minimum price ${symbol} 'applyToMarket' property is false: ${JSON.stringify(
          minimumPriceData,
        )}`,
      );

    return minimumPriceData.minNotional;
  }

  async quotePrecision(symbol) {
    const lotSize = await this.symbolFilter(symbol, binanceApiUtils.LOT_SIZE_FILTER);

    return calculator.quotePrecision(lotSize.minQty);
  }
};
