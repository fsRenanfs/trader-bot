const buildException = (exception, message) => `[${exception}] - ${message}`;

const binanceApiException = message => buildException('BinanceApiException', message);
const binanceWSException = message => buildException('binanceWSException', message);
const indicatorException = message => buildException('IndicatorException', message);

module.exports = { binanceApiException, binanceWSException, indicatorException };
