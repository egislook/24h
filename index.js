const express   = global.express = require('express');
const app       = express();
const Riothing  = true && require('riothing') || require('../../_packs/riothing/index.js');

const CFG = {
  INIT_ACTION_NAME:   'INIT_APP',
  PUB_DIR:  __dirname + '/public',
  // process vars
  PORT:       process.env.PORT  || 3001,
  IP:         process.env.IP    || 'localhost',
  DEV:        process.env.NODE_ENV === 'development',
  VER:        process.env.npm_package_version,
  CLIENTLESS: false,
  SERV_STYLE: true,
  READY:      false,
  SYNC:       false,
};
CFG.url = CFG.DEV ? `http://${CFG.IP}:${CFG.PORT}` : 'https://coinmarks.herokuapp.com';

app.use('/', express.static(CFG.PUB_DIR));

/** TODO!!!
    1. Clean dev env and tools (sort this stupid server starting issue. Can everything be moved to riothing. Just include express inside it)
    2. generate css file
    3. Create default actions.js, store.js, root.html inside riothing
    4. sort out route.js issue
**/

if(CFG.DEV){
  app.use('/packs', express.static('../../_packs'));
  app.get('/cfg', (req, res) => { res.json(CFG) });
  app.use((req, res, next) => {
    CFG.READY ? CFG.SYNC = true : false;
    next();
  });
  app.listen(CFG.PORT, () => console.log('APP => ' + CFG.url));
}

Riothing(CFG, { app, routes: require(CFG.PUB_DIR + '/data/routes.json') } )
  .then(riothing => {
    CFG.READY = true;
    if(CFG.DEV) return;
    app.listen(CFG.PORT, () => console.log('APP => ' + CFG.url));
    riothing.act('TRIGGER_EXTERNAL_COIN_UPDATE');
  });

//app.use('/', require('./func/root.func.js'));
//app.use('/', riothing.route);
