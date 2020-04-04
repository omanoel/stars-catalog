const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');

// ----------------------------------------------------------------------------
// app
// ----------------------------------------------------------------------------
const app = express();

// authorize local angular webapp
var corsOptions = {
  origin: 'http://localhost:4200'
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// compress all responses
app.use(compression());

// simple route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to stars catalog application.'
  });
});

require('./routes/hyg-catalog-star.routes')(app);
require('./routes/kharchenko.routes')(app);

const port = process.env.PORT || 8080;

const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to the database!');
    app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });