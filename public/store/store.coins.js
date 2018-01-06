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
        const state = this.state.setCoin(symbol);
        this.trigger('SET_COIN', state);
        return state;
      }
    }
  }
  
  function StateCoins(data = {}, prev = {}, def, act){
    
    this.coins  = data && data.coins && data.coins.map(coin => new Coin(coin)) || [];
    this.coin   = null;
    
    this.setCoin = (symbol) => {
      this.coin = symbol && this.coins.filter(coin => coin.symbol === symbol).shift();
      return { coin: this.coin };
    }
    
    return this;
  }
  
  function Coin(data = {}){
    
    this.name     = data.name || 'none';
    this.symbol   = data.symbol;
    this.rank     = data.rank;
    this.logo     = data.logo;
    this.web      = data.web;
    this.markets  = getMarkets(data.markets);
    this.tags     = getTags(this);
    this.price    = getPrice(this.markets);
    return this;
    
    
    function getMarkets(markets){
      return markets.filter(market => market.market.indexOf('BTC') >= 0)
        .map(market => new Market(market));
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
      //return markets.slice().shift().price;
    }
    // "symbol": "PLX",
    // "name": "PlexCoin",
    // "rank": "1203",
    // "logo": "https://files.coinmarketcap.com/static/img/coins/32x32/plexcoin.png",
    // "cap": {
    //   "usd": "None"
    // },
    // "price": {
    //   "usd": "0.0312972"
    // },
    // "web": "https://www.plexcoin.com/",
    // "markets": [
    //   {
    //     "link": "/exchanges/cryptopia/",
    //     "name": "Cryptopia",
    //     "market": "PLX/BTC",
    //     "marketLink": "https://www.cryptopia.co.nz/Exchange?market=PLX_BTC",
    //     "volume": {
    //       "usd": "2671.85",
    //       "btc": "0.202328",
    //       "pc": "100.00%"
    //     },
    //     "price": {
    //       "usd": "0.0312972",
    //       "btc": "2.37e-06"
    //     }
    //   }
  }
  
  function Market({ name, market, marketLink, volume, price }){
    this.name   = name;
    this.market = market;
    this.marketLink = marketLink;
    this.volume = {
      usd: volume.usd,
      pc: volume.pc
    };
    this.price  = {
      usd: price.usd,
      btc: Number(price.btc).toFixed(8)
    };
    return this;
    
  }
}