const technicalindicators = require('technicalindicators');

const RSI = (values, period) => {
  return new technicalindicators.RSI({ period: period, values: values }).result;
};

const RSIOld = (values, period) => {
  const loss = [];
  const gain = [];
  var lossAvg = 0;
  var gainAvg = 0;
  var rs;
  var rsi;

  //values must be  period + 1
  for (var i = 0; i < period; i++) {
    var currentValue = values[i];
    var nextValue = values[i + 1];

    var diff = nextValue - currentValue;

    if (nextValue > currentValue) {
      gain.push(diff);
      continue;
    }

    loss.push(diff);
  }

  lossAvg = loss.reduce((a, b) => a + b, 0) / period;
  gainAvg = gain.reduce((a, b) => a + b, 0) / period;

  rs = gainAvg / lossAvg;

  rsi = 100 - 100 / (1 - rs);

  return rsi;
};

module.exports = { RSI };
