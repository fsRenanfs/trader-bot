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
    const quotePrecision = await this.quotePrecision(symbol);
    const currentPrice = await this.currentPrice(symbol);
    const minimumPrice = await this.minimumPrice(symbol);

    const quantity = calculator.currencyQuantity(usdt, currentPrice);
    const formattedQuantity = calculator.roundFloor(quantity, quotePrecision);

    if (usdt < minimumPrice)
      throw binanceApiException(
        `Minimum price must be greater than ${minimumPrice} for ${symbol} symbol.`,
      );

    console.log(`$$ ORDER: Buy ${formattedQuantity} of ${symbol} (${usdt} USDT)`); //informacoes da ordem, mais objeto da ordem

    const order = await this.marketOrder(symbol, binanceApiUtils.BUY, formattedQuantity);

    console.log(`$$ ORDER COMPLETED`);
    return order;
  }

  async sell(symbol, quantity) {
    const order = await this.marketOrder(symbol, binanceApiUtils.SELL, quantity);
    console.log(order);
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
    const minimumPrice =
      parseFloat(minimumPriceData.minNotional) + parseFloat(binanceApiUtils.MIN_PRICE_VARIATION);
    return minimumPrice;
  }

  async currentPrice(symbol) {
    const prices = await this.binance.prices({ symbol: symbol });
    return prices[symbol];
  }

  async quotePrecision(symbol) {
    const lotSize = await this.symbolFilter(symbol, binanceApiUtils.LOT_SIZE_FILTER);

    return calculator.quotePrecision(lotSize.minQty);
  }
};
