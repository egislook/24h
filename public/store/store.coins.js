function storeCoins(initState){

  return {
    name:       'coins',
    state:      initState,
    actions:    new Actions(),
    models:     { Coin },
    model:      StateCoins,
  };

  function Actions(){
    return {
      'SET_COIN': function({ symbol }){
        // const state = this.state.setCoin(symbol);
        // this.trigger('SET_COIN', state);
        // return state;
      }
    }
  }

  function StateCoins(data = {}, prev = {}, def, act){

    this.coins  = data && data.coins && data.coins.map(coin => new Coin(coin)) || [];
    this.coin   = null;

    this.setCoin = (symbol) => {
      this.coin = symbol && this.coins.filter(coin => coin.symbol === symbol).shift();
      //console.log(this);
      return { coin: this.coin };
    }

    this.coins = this.coins.filter(coin => !!coin.stats).sort( (a, b) => a.stats.rank - b.stats.rank);

    return this;
  }

  function Coin(data = {}){
    
    this.name     = data.name || 'none';
    this.website  = data.extras && data.extras.website;
    this.symbol   = data.symbol;
    this.rank     = data.rank;
    this.link     = data.link;
    this.logo     = data.logo || data.id && `https://files.coinmarketcap.com/static/img/coins/32x32/${data.id}.png`;
    this.web      = data.web;
    this.supply   = data.supply;
    this.listed   = data.listed;
    this.markets  = data.extras   && data.extras.markets && getMarkets(data.extras.markets, this.symbol);
    this.tags     = data.markets  && getTags(this);
    this.price    = data.markets  && getPrice(this.markets);
    this.stats    = data.stats    && new Stats(data.stats);
    this.stage    = getStage(this.listed);
    return this;


    function getMarkets(markets, symbol){
      return Object.keys(markets).map(id => new Market(markets[id], symbol)).sort((a, b) => b.pc - a.pc);
    }

    function getTags({ name, symbol, markets }){
      let tags = [];
      tags.push(name.toLowerCase(), symbol.toLowerCase());
      return tags.concat(markets.slice().map(market => market.name.toLowerCase()));
    }

    function getPrice(markets){
      let market = markets.slice().shift();
      return {
        usd: market && market.price && market.price.usd || 'NA',
        btc: market && market.price && market.price.btc || 'NA'
      };
    }

    function getStage(listed){
      let now = new Date().getTime();
      let day = 24 * 60 * 60 * 1000;
      if(listed + (2 * 30 * day) > now)
        return 'fresh';
      if(listed + (8 * 30 * day) > now)
        return 'new';
      if(listed + (24 * 30 * day) > now)
        return 'neo';
      return 'old';
    }
  }

  function Stats(data){
    this.rank   = parseInt(data.rank);
    this.price  = {
      usd: Number(data.price_usd).toFixed(2),
      btc: Number(data.price_btc).toFixed(2),
      sat: parseInt(Number(data.price_btc) * 100000000)
    };
    this.change = {
      hour:   Number(data.percent_change_1h),
      day:    Number(data.percent_change_24h),
      weak:   Number(data.percent_change_7d),
    };
    this.up     = this.change.day > 0;
    this.supply = Number(data.available_supply || data.total_supply || data.max_supply);
    this.cap    = Number(data.market_cap_usd);
    this.volume = Number(data['24h_volume_usd']);

    this.shortVolume = this.volume > 100000
      ? (this.volume / 1000000).toFixed(1) + 'kk'
      : this.volume;

    this.shortSupply = this.supply > 100000
      ? (this.supply / 1000000).toFixed(1) + 'kk'
      : this.supply;

    //ripple supply
    this.estimated = (this.supply * Number(this.price.usd) / 39000000000).toFixed(3);

    this.trash = this.volume < 400000;

    return this;
  }

  function Market({ name, volume, price, pc, exchanges }, symbol){
    this.name   = name;
    this.volume = volume;
    this.price  = price;
    this.pc     = pc;
    
    this.exchanges = exchanges.map(exchange => ({
      symbol: exchange.symbol,
      link:   exchange.link,
      type:   exchange.symbol.split('/'),
    })).filter(exchange => exchange.type[0] === symbol);

    return this;

  }
}
