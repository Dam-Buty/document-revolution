
module.exports = function(Delta) {
  return {
    data: {             // this data is sent to the plugin's route starter
      box: "INBOX",
      search: [ ['X-GM-RAW', 'has:attachment'] ]
    },
    semantics: function(hit) {
      return {
        world: "whoknows"
      }
    },
    action: {
      type: "out/mail",
      template: "employee/newpay"
    }
  };
};
