const technicalindicators = require('technicalindicators');

const RSI = (values, period) => {
  return new technicalindicators.RSI({ period: period, values: values }).result;
};

module.exports = { RSI };
