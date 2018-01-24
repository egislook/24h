const express   = global.express = require('express');
const app       = express();
const Riothing  = require('../_packs/riothing');

const CFG = {
  PORT: process.env.PORT  || 3001,
  IP:   process.env.IP    || '127.0.0.1',
  INIT_ACTION_NAME:       'INIT_APP',
  PUB_DIR:                __dirname + '/public'
};

Object.assign(CFG, {
  url: `http://${CFG.IP}:${CFG.PORT}`,
  app
});

app.use('/', express.static('./public'));

app.response.render = Riothing.utils.renderHTML;

app.listen(CFG.PORT, CFG.IP, () => console.log('APP => ' + CFG.url));

Riothing(CFG);
//riothing.act('APP_INIT');

//riothing.act('APP_INIT');

//console.log(riothing);

//app.use('/', require('./func/root.func.js'));
//app.use('/', riothing.route);
