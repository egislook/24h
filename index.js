const express   = global.express = require('express');
const app       = express();
const Riothing  = true && require('riothing') || require('../_packs/riothing/index.js');

const CFG = {
  PORT: process.env.PORT  || 3001,
  IP:   process.env.IP    || '127.0.0.1',
  INIT_ACTION_NAME:       'INIT_APP',
  PUB_DIR:                __dirname + '/public',
  DEV:                    process.env.NODE_ENV === 'development'
};

Object.assign(CFG, {
  url: CFG.DEV ? `http://${CFG.IP}:${CFG.PORT}` : 'https://coinmarks.herokuapp.com',
  app
});

app.use('/', express.static(CFG.PUB_DIR));

app.response.render = Riothing.utils.renderHTML;

app.listen(CFG.PORT, () => console.log('APP => ' + CFG.url));

Riothing(CFG);
//riothing.act('APP_INIT');

//riothing.act('APP_INIT');

//console.log(riothing);

//app.use('/', require('./func/root.func.js'));
//app.use('/', riothing.route);
