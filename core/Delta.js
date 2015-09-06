
module.exports = function(_) {
  return {
    tables: {
      employees: {
        B51223: {
          name: "John the Barbarian",
          email: "john@kerbodyne.kom"
        },
        A23598: {
          name: "Petyr the Sage",
          email: "petyr@kerbodyne.kom"
        }
      },

      months: [ "",
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
      ]
    },

    /*
    * Unhash : get the value of hash 'key' inside table 'table', or an empty string
    */
    unhash: function(key, table) {
      var data = this.tables[table];

      console.log(data);

      if (data !== undefined) {
        var val = data[key] || data[key * 1]; // key * 1 to correctly address arrays
        if (val !== undefined) {
          _.emit("info", "Successfully unhashed <" + key + ">, value dump follows");
          _.emit("dump", val);
          return val;
        } else {
          _.emit("error", "Failed to unhash <" + key + ">: key does not exist in table <" + table + ">!");
        }
      } else {
        _.emit("error", "Failed to unhash <" + key + ">: table <" + table + "> does not exist!");
      }

      return "";
    },
  };
} ;
