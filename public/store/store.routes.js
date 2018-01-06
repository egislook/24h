function storeRoutes(initState){
  
  return {
    name:       'routes',
    state:      initState,
    actions:    new Actions(),
    models:     { Route, Meta },
    model:      StateRoutes,
  };
  
  function Actions(){
    return {
      'SET_ROUTE': function({ page, query, cookies }){
        this.act('SET_COIN', { symbol: page });
      },
    }
  }
  
  function StateRoutes(data = {}, prev = {}, def, act){
    def = def || {
      routes: [
        { main: true, name: 'main' },
        { name: 'todo' }
      ],
      metas: {
        main: { title: 'app main title' },
        todo: { title: 'app todo title' },
      }
    };
    
    this.routes = getRoutes(data.routes || prev.routes || def.routes);
    this.metas  = getMetas(data.metas || prev.metas || def.metas, act);
    
    this.ready  = data.ready  || prev.ready   || false;
    this.page   = data.page   || prev.page    || 'main';
    this.splash = data.splash;
    
    //generated values
    this.route    = this.routes.filter((route) => route.name === this.page).shift();
    this.meta     = this.metas[this.page] || this.metas['main'];
    this.subroute = this.splash && this.routes.filter((subroute) => subroute.name === this.splash).shift();
    
    function getMetas(metas, act){
      metas = Object.assign({}, metas);
      for(let name in metas){
        metas[name] = new Meta(metas[name]);
      }
      return metas;
    }
    
    function getRoutes(routes){
      return routes.slice().map( route => new Route(route));
    }
    
    return this;
  }
  
  function Route(data = {}){
    this.name   = data.name || 'none';
    this.main   = data.main || false;
    this.link   = data.link || this.main && '/' || '/' + this.name;
    this.view   = data.view || 'page-' + this.name;
    this.clean  = data.clean;
    this.test   = '$def.tadam';
    
    return this;
  }
  
  function Meta(data = {}){
    //console.log(data, act, act && act('GET_DEF', data.title));
    //console.log(data.title, data.desc);
    this.title    = data.title || 'Poinout app';
    this.desc     = data.desc  || 'Simple app description';
    this.author   = data.author   || 'egis';
    this.image    = data.image    || '';
    this.url      = data.url      || '';
    this.favicon  = data.favicon  || 'favicon.ico';
    
    return this;
  }
}