var moment = require("moment");
console = require('better-console');

module.exports = function() {
  return {
    name: "Omega",
    exposes: ["dump", "info", "warn", "error"],

    dev: false,                            // dev mode allows dumping objects to the console
    logLevel: [true, true, true, true],   // [info, warning, error, _ (event handler)]

    timestamp: function() {
      return moment().format("YYYY/MM/DD - HH:mm:ss");
    },

    dump: function(message) {
      if (this.dev) {
        console.dir(message, {depth: null, colors: true});
      }
    },

    _: function(message) {
      if (this.logLevel[3]) {
        console.info("__ - " + this.timestamp() + " : " + message);
      }
    },

    info: function(message) {
      if (this.logLevel[0]) {
        console.info("I - " + this.timestamp() + " : " + message);
      }
    },

    warn: function(message) {
      if (this.logLevel[1]) {
        console.warn("W - " + this.timestamp() + " : " + message);
      }
    },

    error: function(message) {
      if (this.logLevel[2]) {
        console.error("E - " + this.timestamp() + " : " + message);
      }
    }
  }
};
