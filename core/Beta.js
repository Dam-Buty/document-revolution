// Beta receives a hit from a route
module.exports = function(_) {
  return {
    name: "Beta",
    exposes: ["registerRoute", "hit"],

    routes: {
      registered: {},
      register: function(route, semantics) {
        _.emit("info", ("Registering route <" + route + "> semantics on Beta..."));
        this.registered[route] = semantics;
      }
    },

    registerRoute: function(route, semantics) {
      this.routes.register(route, semantics);
    },

    hit: function(hit) {
      hit["timestamp"] = new Date();

      _.emit("info", "Beta got a hit on route <" + hit.route + "> with file <" + hit.filename + ">. Hit dump follows.");
      _.emit("dump", hit);

      // Resolves the semantics from one of the registered routes
      var semantics = this.routes.registered[hit.route](hit);

      _.emit("info", "Semantics resolved on file <" + hit.filename + ">. Semantics dump follows.");
      _.emit("dump", semantics);

      _.emit("gamma-hit", {
        hit: hit,
        semantics: semantics
      });
    }
  };
};
