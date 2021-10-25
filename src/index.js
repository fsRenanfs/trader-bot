const BinanceWebSocketManager = require('./connection/binance_websocket_manager');
const botConfig = require('../bot_conf.json');
const config = require('../conf.json');

//express para testes no heroku
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 5000);

//For avoidong Heroku $PORT error
app
  .get('/', function(request, response) {
    var result = 'App is running';
    response.send(result);
  })
  .listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
  });

//--------------------------

const ws = new BinanceWebSocketManager(
  config.binanceWebSocketUrl,
  botConfig.symbols,
  botConfig.interval,
  botConfig.strategy,
);

ws.start();
