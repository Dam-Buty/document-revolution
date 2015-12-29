Inotify = require('inotify').Inotify;
var inotify = new Inotify(); //persistent by default, new Inotify(false) //no persistent

module.exports = function(_) {
  return {
    type: "async",                                                  // type, channel and description
    channel: "in",                                                  // are standard properties and should always be present
    description: "Simple inotify at the root of the application",

    params: {                                                       // the content of params is free
      base: "/var/www/xdino/in/"                     // it should not however be accessed from outside
    },

    watched: {},                                                    // watchers should hold the handlers

    // Start listening on a route
    startRoute: function(route, data) {
      var watched = {
        path:      this.params.base + data.path,
        watch_for: Inotify.IN_CREATE,
        callback:  function(event) {
          _.emit("dump", event);
          _.emit("beta-hit", {                  // when hit, a route should return a standard hit object to Beta
            route: route,
            filename: event.name,
            data: {}
          });
        }
      };

      this.watched[route] = inotify.addWatch(watched);
    }
  };
};
