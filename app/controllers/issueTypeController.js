var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  IssueType = mongoose.model('IssueType');

  module.exports = function (app) {
  app.use('/api/issuetypes', router);
};

function convertMongoIssueType(issueType) {
  return {
    id: issueType.id,
    name: issueType.name,
    description: issueType.description
  }
}

router.route('/')
  .get(function (err, issueTypes){
    if (err) return next(err);
    res.json(_.map(issueTypes, function (issueType){
      return convertMongoIssueType(issueType);
    }));
  })

  .post(function (req, res, next){
    var issueType = new IssueType({
      name: req.body.name,
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
      issueType.name = req.body.name;
      issueType.description = req.body.description;

      issueType.save(function (err, issueTypeSaved){
        res.json(convertMongoIssueType(issueTypeSaved));
      });
    });
  });