function appActions(){

  return {

    INIT_APP: function({ url, app }, cb){
      console.log('ACTION_APP_INIT', 'v' + this.VER);
      this.store('app').set({ version: this.VER });
      
      return this.act('GET_ALL_CONTENT', { url })
        .then(content => this.act('INIT_ROUTER', { app }));
    },

    INIT_ROUTER: function({ app }){
      //Server router init
      if(this.SERVER)
        return app.use('/:page?', (req, res) => {
          this.act('APP_ROUTE', {
            page:   req.params.page,
            query:  req.query
          });
          res.send(res.render());
        });

      //Client router init
      route(page => this.act('APP_ROUTE', { page, query: route.query() }));
      route.base('/');
      route.start(1);
      // init app
      riot.mount('tag-app');
    },
    
    TRIGGER_EXTERNAL_COIN_UPDATE: function(){
      !this.DEV && this.SERVER && 
        fetch('http://scrapis.herokuapp.com/coinmarks/update')
          .then(res => res.json())
          .then(console.log)
    },

    GET_CONTENT: function({ url }){
      url = url || '';
      return fetch(url + '/content.json')
        .then(res => res.json())
        .then(json => this.store('coins').set(json))
    },

    GET_ALL_CONTENT: function({ url }){
      url = url || '';
      const links = [
        !this.DEV && 'https://coinmarks-e92c0.firebaseio.com/coins.json'    || url + '/coins.json',
        !this.DEV && 'https://api.coinmarketcap.com/v1/ticker/?limit=9999'  || url + '/prices.json'
      ]
      return Promise.all( links.map(link => fetch(link).then(res => res.json())) )
        .then( ([coins, prices]) => {
          const statIds = prices.slice().map(stat => stat.id);
          let coin;
          coins = Object.keys(coins).map(id => {
            coin = coins[id];
            coin.stats = prices[statIds.indexOf(id)];
            return coin;
          });
          //content.coins = content.coins.slice(0, 5);
          return this.store('coins').set({ coins })
        })
    },

    APP_ROUTE: function({ page, query }){
      console.log('ACTION_APP_ROUTE');
      this.act('SET_COIN', { symbol: page });
    },

    SET_COIN: function({ symbol }){
      const state = this.store('coins').state.setCoin(symbol);
      this.store('coins').state.coin = state.coin;
      !this.SERVER && this.trigger('SET_COIN', state);
      return state;
    }

    // 'GET_TRADES': function({ symbol }, cb){
    //   const self    = this;
    //   const aggTickerURL = `https://www.binance.com/api/v1/aggTrades?limit=500&symbol=${symbol}`;
    //
    //   return fetch(aggTickerURL)
    //     .then(res    => res.json())
    //     .then(trades => self.store('app').act('ADD_TRADES', trades))
    // },
  }
}
