const buildException = (exception, message) => `[${exception}] - ${message}`;

const binanceApiException = message => buildException('BinanceApiException', message);
const indicatorException = message => buildException('IndicatorException', message);

module.exports = { binanceApiException, indicatorException };
