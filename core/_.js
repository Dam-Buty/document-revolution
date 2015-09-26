var EventEmitter = require("events").EventEmitter;

module.exports = function(Omega) {
  return {
    ee: new EventEmitter(),

    on: function(event, callback) {
      this.ee.on(event, callback);
    },

    once: function(event, callback) {
      this.ee.once(event, callback);
    },

    emit: function(event, arg1, arg2, arg3, arg4, arg5) {
      this.ee.emit(event, arg1, arg2, arg3, arg4, arg5);
    },

    expose: function(machine, noSuffix) {
      if (noSuffix === undefined) {
        noSuffix = false;
      } else {
        noSuffix = true;
      }

      var self = this;

      machine.exposes.forEach(function(functionName) {
        var callback = machine[functionName];

        if(callback !== undefined) {
          if (callback instanceof Function) {
            var args = callback.length;
            var eventName;

            if (noSuffix) {
              eventName = functionName;
            } else {
              eventName = machine.name.toLowerCase() + "-" + functionName;
            }

            Omega._("Exposing event <" + functionName + "> to machine <" + machine.name + "> with " + args + " arguments");

            var boundCallback = undefined;

            // the callback is bound so 'this' refers to the machine in there
            self.ee.on(eventName, function(arg1, arg2, arg3, arg4, arg5) {
              switch(args) {
                case 0:
                  boundCallback = callback.bind(machine);
                  break;
                case 1:
                  boundCallback = callback.bind(machine, arg1);
                  break;
                case 2:
                  boundCallback = callback.bind(machine, arg1, arg2);
                  break;
                case 3:
                  boundCallback = callback.bind(machine, arg1, arg2, arg3);
                  break;
                case 4:
                  boundCallback = callback.bind(machine, arg1, arg2, arg3, arg4);
                  break;
                case 5:
                  boundCallback = callback.bind(machine, arg1, arg2, arg3, arg4, arg5);
                  break;
              };

              // suffix-less events are not logged as diligently
              if (!noSuffix) {
                Omega._("Intercepted event <" + functionName + "> on machine <" + machine.name + ">. Arguments dump follows.");
                Omega.dump(arguments);
              }

              boundCallback();
            });
          } else {
            Omega.error("Couldn't register event <" + functionName + "> on machine <" + machine.name + "> : property isn't a function")
          }
        } else {
          Omega.error("Couldn't register event <" + functionName + "> on machine <" + machine.name + "> : property doesn't exist in machine");
        }
      });
    }
  }
};
