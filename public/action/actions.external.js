function externalActions(){

  return {
    
    TRIGGER_EXTERNAL_COIN_UPDATE: function(){
      !this.DEV && this.SERVER && 
        fetch('http://scrapis.herokuapp.com/coinmarks/update')
          .then(res => res.json())
          .then(console.log)
    },
  }
}
