var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var _ = require('lodash');
var $fh = require('fh-mbaas-api');

module.exports = function fhstatsRoute() {

  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser());

  router.get('/:counter/:direction', moveCounter);

  return router;
};

function moveCounter(req, res) {
  if (req.params.direction === 'up') {
    $fh.stats.inc(req.params.counter);
    res.status(200).end();
  } else if (req.params.direction === 'down') {
    $fh.stats.dec(req.params.counter);
    res.status(200).end();
  } else {
    res.status(400).json({error: "Not a valid direction param"});
  }
}
