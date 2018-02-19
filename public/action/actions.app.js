function appActions(){

  return {

    INIT_APP: function({ url, app }, cb){
      console.log('ACTION_APP_INIT', 'v' + this.VER);
      this.store('app').set({ version: this.VER });

      return this.act('GET_ALL_CONTENT', { url })
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
        !this.DEV && 'https://coinmarks-e92c0.firebaseio.com/coins.json'    || url + '/data/coins.json',
        !this.DEV && 'https://api.coinmarketcap.com/v1/ticker/?limit=9999'  || url + '/data/prices.json',
        !this.DEV && 'https://coinmarks-e92c0.firebaseio.com/extras.json'   || url + '/data/extras.json',
      ]
      return Promise.all( links.map(link => fetch(link).then(res => res.json())) )
        .then( ([coins, prices, extras]) => {
          const statIds = prices.slice().map(stat => stat.id);
          let coin;
          coins = Object.keys(coins).map(id => {
            coin = coins[id];
            coin.stats  = prices[statIds.indexOf(id)];
            coin.extras = extras[id];
            return coin;
          });
          //content.coins = content.coins.slice(0, 5);
          return this.store('coins').set({ coins })
        })
    },

    APP_ROUTE: function(req, res, next){
      console.log('ACTION_APP_ROUTE', req.params, req.query, req.cookies.get());
      this.act('SET_COIN', { symbol: req.params.page });
      next && next();
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
