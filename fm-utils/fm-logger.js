
const LOGGER = Symbol('logger');

var Logger = {
  levels: {
    DEBUG: Symbol('debug'),
    INFO : Symbol('info'),
    WARN : Symbol('warn')
  },
  l: function(...args){
    console.log(...args);
  },
  i: function(...args){
    console.log(this.levels.INFO,...args);
  },
  d: function(...args){
    console.log(this.levels.DEBUG,...args);
  },
  w: function(...args){
    console.log(this.levels.WARN, ...args);
  }
}

if (!global[LOGGER]) {
  global[LOGGER] = Logger;
}

module.exports = global[LOGGER];