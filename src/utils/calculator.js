const currencyQuantity = (usdt, cryptoPrice) => parseFloat(usdt) / parseFloat(cryptoPrice);

const roundFloor = (value, precision) => {
  const precisionAux = Math.pow(10, precision);
  return Math.floor(value * precisionAux) / precisionAux;
};

const quotePrecision = value => value.toString().indexOf(1) - 1;

module.exports = { currencyQuantity, roundFloor, quotePrecision };
