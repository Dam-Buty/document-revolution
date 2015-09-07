// Alpha is the core object, handling plugins and routes operation
module.exports = function(_) {
  return {
    name: "Alpha",
    exposes: ["startRoute", "registerPlugin"],

    plugins: {
      registered: {},
      register: function(plugin, routes, Delta) {
        this.registered[plugin.channel] = plugin;

        // Check if the plugin has an init function
        // the init function should emit an "alpha-ready-*" event when it is ready
        if (plugin.init !== undefined && plugin.init instanceof Function) {
          _.emit("info", "Initializing plugin <" + plugin.channel + ">...");
          plugin.init();
          var self = this;

          _.once("alpha-ready-" + plugin.channel, function() {
            _.emit("info", "Plugin <" + plugin.channel + "> READY");
            self.startRoutes(plugin, routes, Delta);
          });
        } else { // otherwise start registering routes immediately
          this.startRoutes(plugin, routes, Delta);
        }
      },

      startRoutes: function(plugin, routes, Delta) {
        _.emit("info", "Opening routes on plugin <" + plugin.channel + ">...");

        // requires all the routes and starts them
        routes.forEach(function(routeName) {
          var path = "../plugins/routes/" + plugin.channel + "-" + routeName + ".js";

          var RouteFactory = require(path);
          var route = RouteFactory(Delta);

          _.emit("alpha-startRoute", plugin.channel, routeName, route.data);
          _.emit("beta-registerRoute", routeName, route.semantics);
        });
      }
    },

    startRoute: function(channel, route, data) {
      _.emit("info", "Starting route listener <" + route + "> on plugin <" + channel + ">...");
      this.plugins.registered[channel].startRoute(route, data);
    },

    registerPlugin: function(plugin, routes, Delta) {
      _.emit("info", "Registering plugin <" + plugin.channel + "> (" + plugin.description + ") on Alpha...");
      this.plugins.register(plugin, routes, Delta);
    }
  }
};
