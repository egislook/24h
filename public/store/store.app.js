function storeApp(initState){

  return {
    name:       'app',
    state:      initState,
    models:     {},
    model:      StateApp,
  };

  function StateApp(data = {}, prev = {}, def, act){
    
    this.version = data.version;

    return this;
  }
}
