const express   = global.express = require('express');
const app       = express();
const riothing  = require('riothing');
riothing.config({ pub: __dirname + '/public' });

app.use('/', express.static('./public'));

console.log(riothing);

//app.use('/', require('./func/root.func.js'));
app.use('/', riothing.route);

app.listen(process.env.PORT || 3000, 
  () => console.log(`APP Is started at port ${process.env.PORT || 3000}!`));