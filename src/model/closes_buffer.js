module.exports = class ClosesBuffer {
  constructor(symbols, bufferSize = 60) {
    this.symbolCloses = new Map();
    this.bufferSize = bufferSize;
    symbols.forEach(symbol => this.symbolCloses.set(symbol, []));
  }

  push(symbol, closePrice) {
    const closes = this.symbolCloses.get(symbol);
    closes.push(parseFloat(closePrice));

    if (closes.length > this.bufferSize) {
      closes.shift();
    }

    this.symbolCloses.set(symbol, closes);
  }

  length(symbol) {
    const closes = this.symbolCloses.get(symbol);
    return closes.length;
  }

  get(symbol) {
    return this.symbolCloses.get(symbol);
  }
};
