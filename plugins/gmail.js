var Imap = require('imap');

var imap =

module.exports = function(_) {
  return {
    type: "async",
    channel: "gmail",
    description: "Simple GMail interface",

    params: {                                                             // the content of params is free
      user: 'tonyravioli.dino@gmail.com',
      password: 'C4dillac5',
      host: 'imap.gmail.com',
      port: 993,
      tls: true
    },

    watched: undefined,                                                    // watchers should hold the handlers if any

    init: function() {
      var self = this;
      this.watched = new Imap(this.params);

      this.watched.once('ready', function() {
        _.emit("alpha-ready-gmail");
      });

      this.watched.once('error', function(err) {
        _.emit("error", "Couldn't connect to IMAP Mailbox. Error dump follows.");
        _.emit("dump", err);
      });

      this.watched.connect();
    },

    // Start listening on a route
    startRoute: function(route, data) {
      var self = this;

      this.watched.openBox(data.box, true, function(err, box) {
        if (err) throw err;
        self.watched.search(data.search, function(err, results) {
          if (err) throw err;
          var f = self.watched.fetch(results, { bodies: '' });

          f.on('message', function(msg, seqno) {
            console.dir('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
              var body = "";

              stream.on('data', function(chunk) {
                body += chunk;
              });

              stream.on("end", function() {
                console.dir(prefix + 'Body');
                console.dir(body);
              })
            });
            msg.once('attributes', function(attrs) {
              console.dir(prefix + 'Attributes: %s');
              console.dir(attrs);
            });
            msg.once('end', function() {
              console.dir(prefix + 'Finished');
            });
          });

          f.once('error', function(err) {
            _.emit("error", "There was an error while fetching a message. Error dump follows.");
            _.emit("dump", err);
          });

          f.once('end', function() {
            _.emit("info", "Done fetching mail");
            self.watched.end();
          });
        });
      });

      // var watched = {
      //   path:      this.params.base + data.path,
      //   watch_for: Inotify.IN_CREATE,
      //   callback:  function(event) {
      //     _.emit("dump", event);
      //     _.emit("beta-hit", {                  // when hit, a route should return a standard hit object to Beta
      //       route: route,
      //       filename: event.name,
      //       data: {}
      //     });
      //   }
      // };
      //
      // this.watched[route] = inotify.addWatch(watched);
    }
  };
};
