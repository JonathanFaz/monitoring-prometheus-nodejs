'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const promMid = require('express-prometheus-middleware');
const app = express();
const port = process.argv[2] || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));

app.use('/api/greeting', (request, response) => {
  const name = request.query.name ? request.query.name : 'World';
  response.send({content: `Hello, ${name}!`});
});
 

app.use('/resolve/google', (request, response) => {
  require('dns').resolve('www.google.com', function(err) {
  if (err) {
    response.send({content: "No Connection"});
  } else {
    response.send({content: "Connected"});
  }
  })
});

app.use('/error', (request, response) => {
  response.status(500).send();
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));