
module.exports = function(Delta) {
  return {
    data: {             // this data is sent to the plugin's route starter
      path: "payroll"
    },
    semantics: function(hit) {
      return {
        world: "hr",
        type: "salary",
        employee: Delta.unhash(hit.filename.split("_")[0], "employees"),
        month: Delta.unhash(hit.filename.split(".")[0].split("_")[2], "months"),
        year: hit.filename.split(".")[0].split("_")[1]
      }
    },
    action: {
      type: "out/mail",
      template: "employee/newpay"
    }
  };
};
