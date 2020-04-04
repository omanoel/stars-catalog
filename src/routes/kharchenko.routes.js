module.exports = app => {
  const kharchenkoCtrl = require("../controllers/kharchenko.controller.js");

  var router = require("express").Router();

  // Get a csv from a dat file
  router.get("/:file", kharchenkoCtrl.getCsv);

  app.use('/api/kharchenko', router);
};