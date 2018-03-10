function externalActions(){

  return {
    TRIGGER_EXTERNAL_COIN_UPDATE: function(){
      !this.DEV && this.SERVER &&
        fetch('http://scrapis.herokuapp.com/coinmarks/update')
          .then(res => res.json())
          .then(console.log)
    },

    TRIGGER_DEV_TIMESTAMP_TICKER: function(delay){
      setInterval(intervalFn, delay || 2000);
      function intervalFn(){
        fetch('/cfg').then(res => res.json())
          .then(({ READY, SYNC }) => !SYNC && READY && location.reload());
      }
    }
  }
}
