const technicalindicators = require('technicalindicators');
const { indicatorException } = require('../exceptions/exceptions');

const RSI = (values, period) => {
  if (values.length <= period)
    throw indicatorException(
      `Values length must be greater than selected period to calculate RSI indicator. Period: ${period}`,
    );

  return new technicalindicators.RSI({ period: period, values: values }).result;
};

module.exports = { RSI };
