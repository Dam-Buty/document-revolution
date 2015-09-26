
module.exports = function(_) {
  return {
    name: "Gamma",
    exposes: ["route", "hit"],

    documents: [],

    hit: function(hit) {
      this.documents.push(hit);
      _.emit("info", "Gamma got a hit from route <" + hit.route + "> with file <" + hit.filename + ">. Documents dump follows.");
      _.emit("dump", this.documents);
    }
  };
};
