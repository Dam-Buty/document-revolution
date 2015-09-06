// Alpha is the core object, handling plugins and routes operation
module.exports = function(_) {
  return {
    name: "Alpha",
    exposes: ["startRoute", "registerPlugin"],

    plugins: {
      registered: {},
      register: function(plugin) {
        _.emit("info", "Registering plugin <" + plugin.channel + "> (" + plugin.description + ") on Alpha...");
        this.registered[plugin.channel] = plugin;
      }
    },

    startRoute: function(channel, route, data) {
      this.plugins.registered[channel].startRoute(route, data);
    },

    registerPlugin: function(plugin, routes, Delta) {
      this.plugins.register(plugin);

      // requires all the routes and starts them
      routes.forEach(function(routeName) {
        var path = "../plugins/routes/" + plugin.channel + "-" + routeName + ".js";

        var RouteFactory = require(path);
        var route = RouteFactory(Delta);

        _.emit("info", "Opening route <" + routeName + "> on plugin <" + plugin.channel + ">...");
        _.emit("alpha-startRoute", plugin.channel, routeName, route.data);
        _.emit("beta-registerRoute", routeName, route.semantics);
      });
    }
  }
};
