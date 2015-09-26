// Require the different modules
var AlphaFactory = require("./core/Alpha.js");
var BetaFactory = require("./core/Beta.js");
var GammaFactory = require("./core/Gamma.js");
var DeltaFactory = require("./core/Delta.js");
var OmegaFactory = require("./core/Omega.js");
var EventHandlerFactory = require("./core/_.js");

// Initialize the modules /!\ the order is important
var Omega = OmegaFactory();
var _ = EventHandlerFactory(Omega); // The Event Handler needs Omega
var Alpha = AlphaFactory(_);        // The subsequent modules need the Event Handler
var Beta = BetaFactory(_);
var Gamma = GammaFactory(_);
var Delta = DeltaFactory(_);

// Expose the events declared in each module
_.expose(Alpha);
_.expose(Beta);
_.expose(Gamma);
_.expose(Omega, true); // Omega is exposed with no suffix,
                       // meaning its events will be "info", "error" instead of "omega-info"...

// custom.json lists the required plugins and their routes
var custom = require("./custom.json");

// Loop on the plugins to require them (each plugin starts its own routes once ready)
Object.keys(custom.plugins).forEach(function(key) {
  var routes = custom.plugins[key];
  var path = "./plugins/" + key + ".js";

  var PluginFactory = require(path);
  var plugin = PluginFactory(_);

  _.emit("alpha-registerPlugin", plugin, routes, Delta);
})
