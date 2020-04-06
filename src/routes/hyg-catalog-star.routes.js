module.exports = app => {
  const hygCatalogStarCtrl = require("../controllers/hyg-catalog-star.controller.js");

  var router = require("express").Router();

  // Create a new HygCatalogStar
  router.post("/", hygCatalogStarCtrl.create);

  // Retrieve all HygCatalogStars
  router.get("/", hygCatalogStarCtrl.findAll);

  // Search HygCatalogStars
  router.get("/search/:criterias", hygCatalogStarCtrl.search);

  // Init the data
  router.get("/init/:start", hygCatalogStarCtrl.init);

  // Retrieve all published HygCatalogStars
  router.get("/published", hygCatalogStarCtrl.findAllPublished);

  // Retrieve a single HygCatalogStar with id
  router.get("/:id", hygCatalogStarCtrl.findOne);

  // Update a HygCatalogStar with id
  router.put("/:id", hygCatalogStarCtrl.update);

  // Delete a HygCatalogStar with id
  router.delete("/:id", hygCatalogStarCtrl.delete);

  // Create a new HygCatalogStar
  router.delete("/", hygCatalogStarCtrl.deleteAll);

  app.use('/api/hyg-catalog-star', router);
};