const db = require('../models');
const fs = require('fs');
const HygCatalogStar = db.hygcatalogstar;

// Create and Save a new HygCatalogStar
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content can not be empty!'
    });
    return;
  }

  // Create a HygCatalogStar
  const star = new HygCatalogStar({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  // Save HygCatalogStar in the database
  star
    .save(star)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Tutorial.'
      });
    });
};

// Retrieve all HygCatalogStars from the database.
exports.findAll = (req, res) => {
  let condition = {
    dist: {
      $lt: 30
    }
  };

  var fields = {
    id: 1,
    x: 1,
    y: 1,
    z: 1,
    spect: 1
  };

  HygCatalogStar.find(condition, fields)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving HygCatalogStar.'
      });
    });
};

// Retrieve all HygCatalogStars from the database.
exports.search = (req, res) => {
  let condition = {
    dist: {
      $lt: 3
    }
  };
  if (req.params.criterias) {
    condition = {
      $and: []
    };
    const criterias = JSON.parse(req.params.criterias);
    Object.keys(criterias).forEach(key => {
      if (criterias[key]) {
        const aMinMax = criterias[key].split(':');
        if (aMinMax.length > 0) {
          if (aMinMax[0] !== null && aMinMax[0] !== undefined) {
            const param = {};
            param[key] = {
              $gte: aMinMax[0]
            }
            condition.$and.push(param)
          }
          if (aMinMax[1] !== null && aMinMax[1] !== undefined) {
            const param = {};
            param[key] = {
              $lte: aMinMax[1]
            }
            condition.$and.push(param)
          }
        }
      }
    });
  }
  console.log(condition)
  var fields = {
    id: 1,
    x: 1,
    y: 1,
    z: 1,
    spect: 1
  };

  HygCatalogStar.find(condition, fields)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving HygCatalogStar.'
      });
    });
};

// Find a single HygCatalogStar with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  HygCatalogStar.findOne({
      id: id
    })
    .then(data => {
      if (!data)
        res.status(404).send({
          message: 'Not found HygCatalogStar with id ' + id
        });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving HygCatalogStar with id=' + id
      });
    });
};

// Update a HygCatalogStar by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!'
    });
  }

  const idDb = req.params.idDb;

  HygCatalogStar.findByIdAndUpdate(idDb, req.body, {
      useFindAndModify: false
    })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update HygCatalogStar with id=${idDb}. Maybe HygCatalogStar was not found!`
        });
      } else
        res.send({
          message: 'HygCatalogStar was updated successfully.'
        });
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error updating HygCatalogStar with id=' + idDb
      });
    });
};

// Delete a HygCatalogStar with the specified id in the request
exports.delete = (req, res) => {
  const idDb = req.params.idDb;

  HygCatalogStar.findByIdAndRemove(idDb)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete HygCatalogStar with id=${idDb}. Maybe HygCatalogStar was not found!`
        });
      } else {
        res.send({
          message: 'HygCatalogStar was deleted successfully!'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete HygCatalogStar with id=' + idDb
      });
    });
};

// Delete all HygCatalogStars from the database.
exports.deleteAll = (req, res) => {
  HygCatalogStar.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} HygCatalogStars were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all HygCatalogStars.'
      });
    });
};

// Find all published HygCatalogStar
exports.findAllPublished = (req, res) => {
  HygCatalogStar.find({
      published: true
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving HygCatalogStars.'
      });
    });
};

// Init
exports.init = (req, res) => {
  // Load data file
  const starLines = fs
    .readFileSync('./datas/hygdata_v3.csv')
    .toString()
    .split('\n');
  console.log(starLines.length + ' loaded...');
  const aKeys = starLines[0].split(',');

  // start
  let start = 1;
  if (req.params['start']) {
    start = Number(req.params['start']);
  }
  const aStars = [];
  let max = start + 10000;
  if (max > starLines.length) {
    max = starLines.length;
  }
  for (let i = start; i < max; i++) {
    const starLine = starLines[i];
    if (starLine !== '') {
      const aValues = starLine.split(',');
      const hygCatalogStar = new HygCatalogStar();
      aKeys.forEach((key, idx) => {
        if (key !== 'tyc') {
          hygCatalogStar[key] = aValues[idx];
        }
      });
      aStars.push(hygCatalogStar);
    }
  }

  HygCatalogStar.insertMany(aStars)
    .then(() => {
      console.log(aStars.length + ' inserted...');
      if (max !== starLines.length) {
        res.redirect('/api/hyg-catalog-star/init/' + max);
      } else {
        res.status(200).json({
          status: 'ok',
          count: starLines.length
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occurred while inserting HygCatalogStars.'
      });
    });
};