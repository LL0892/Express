var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Issue = mongoose.model('Issue');

 module.exports = function (app) {
  app.use('/api/issues', router);
};

function convertIssue (issue){
	return{
		id: issue.id,
		author: issue.author,
		responsable: issue.responsable,
		description: issue.description,
		status: issue.status,
		latitude: issue.latitude,
		longitude: issue.longitude,
		issueType: issue.issueType,
		comments: issue.comments,
		createdOn: issue.createdOn,
		updatedOn: issue.updatedOn
	}
}

router.route('/')
// Get all issues
	.get(function (req, res, next){
		Issue.find(function (err, issues){
			if(err) return next(err);
			res.json(_.map(issues, function (issue){
				return convertIssue(issue);
			}))
		});
	})

// Create a new issue
	.post(function (req, res, next) {
		var issue = new Issue({
			author: req.body.author,
			responsable: req.body.responsable,
			description: req.body.description,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			issueType: req.body.issueType
		});

		issue.save(function(err, issueSaved) {
			res.status(201).json(convertIssue(issueSaved));
		});
	})

router.route('/:id')
// Get an issue by id
	.get(function (req, res, next){
		Issue.findById(req.params.id, function(err, issue) {
			res.json(convertIssue(issue));
		});
	})

// Modify an existing issue
	.put(function (req, res, next){
		Issue.findById(req.params.id, function(err, issue) {
			issue.author = req.body.author;
			issue.responsable = req.body.responsable;
			issue.description = req.body.description;
			issue.latitude = req.body.latitude;
			issue.longitude = req.body.longitude;
			issue.issueType = req.body.issueType;
			issue.updatedOn = Date.now;

			issue.save(function(err, issueSaved) {
				res.json(convertIssue(issueSaved));
			});
		});
	});