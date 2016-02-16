var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var _ = require('lodash');
var $fh = require('fh-mbaas-api');
var util = require('util');

module.exports = function fhcacheRoute() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser());

  router.post('/', createOne);

  router.get('/:key', getOneByKey);
  router.delete('/:key', deleteOneByKey);

  return router;
};

function createOne(req, res) {
  if (_.has(req, "body.key") && _.has(req, "body.value")) {
    fhcache(res, _.assign(baseOptions("save"), {
        "key": req.body.key,
        "value": req.body.value,
        "expire": _.get(req, "body.expire", undefined)
    }));
  } else {
    res.status(400).json({error: "missing either key or value"});
  }
}

function getOneByKey(req, res) {
  fhcache(res, _.assign(baseOptions("load"), {
    key: _.get(req, "params.key", "")
  }));
}

function deleteOneByKey(req, res) {
  fhcache(res, _.assign(baseOptions("remove"), {
    key: _.get(req, "params.key", "")
  }));
}

function fhcache(res, options) {
  $fh.cache(options, function (err, data) {
    handleFhcacheErr(res, err);
    res.status(200).json({data:data});
  });
}

function baseOptions(act) {
  return {
    act: act
  };
}

function handleFhcacheErr(res, err) {
  if (err) {
    console.error("Error " + err);
    res.status(400).json({error: err});
  }
}
