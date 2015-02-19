var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  IssueType = mongoose.model('IssueType');

  module.exports = function (app) {
  app.use('/issueTypes', router);
};

function convertMongoIssueType(issueType) {
  return {
    id: issueType.id,
    shortName: issueType.shortName,
    description: issueType.description
  }
}

router.get('/', function (req, res, next) {
  IssueType.find(function (err, issueTypes) {
    if (err) return next(err);
    res.json(issueTypes);
  });
});


router.route('/')
  .get(function (err, issueTypes){
    if (err) return next(err);
    res.json(_.map(issueTypes, function (issueType){
      return convertMongoIssueType(issueType);
    }));
  });

  .post(function (req, res, next){
    var issueType = new IssueType({
      shortName: req.body.shortName,
      description: req.body.description
    });

    issueType.save(function (err, issueTypeSaved){
      res.status(201).json(convertMongoIssueType(issueTypeSaved));
    });
  });

router.route('/:id')
  .get(function (req, res, next){
  	IssueType.findById(function (err, issueType){
  		if(err) return next (err);
  		res.json(convertMongoIssueType(issueType));
  	});
  })

  .delete(function (req, res, next){
    IssueType.findByIdAndRemove(req.params.id, function (err){
      res.status(204).end();
    });
  })

  .put(function (req, res, next){
    IssueType.findById(req.params.id, function (err, issueType){
      issueType.shortName = req.body.shortName;
      issueType.description = req.body.description;

      issueType.save(function (err, issueTypeSaved){
        res.json(convertMongoIssueType(issueTypeSaved));
      });
    });
  });