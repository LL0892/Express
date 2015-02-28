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
		tags: issue.tags,
		comments: issue.comments,
		createdOn: issue.createdOn,
		updatedOn: issue.updatedOn
	}
}

/*
Create an issue, and get all existing issues
Path : /api/issues/
Verbs : GET & POST
*/
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
			issueType: req.body.issueType,
			tags: req.body.tags
		});

		issue.save(function (err, issueSaved) {
			if(err) return next(err);
			res.status(201).json(convertIssue(issueSaved));
		});
	})

/*
Display and modify a specific issue
path : /api/issues/:id
Params : id is an existing issue id
verbs : GET & PUT
*/
router.route('/:id')
// Get an issue by id
	.get(function (req, res, next){
		Issue.findById(req.params.id, function (err, issue) {
			if(err) return next(err);
			res.json(convertIssue(issue));
		});
	})

// Modify an existing issue
	.put(function (req, res, next){
		Issue.findById(req.params.id, function (err, issue) {
			if(err) return next(err);
			issue.author = req.body.author;
			issue.responsable = req.body.responsable;
			issue.description = req.body.description;
			issue.latitude = req.body.latitude;
			issue.longitude = req.body.longitude;
			issue.issueType = req.body.issueType;
			issue.updatedOn = Date.now;
			issue.tags = req.body.tags;

			issue.save(function (err, issueSaved) {
				if(err) return next(err);
				res.json(convertIssue(issueSaved));
			});
		});
	});

/*
Create, update and remove tags on issues
------------------------------------------------------
| /!\ PUT & DELETE aren't currently working properly |
------------------------------------------------------
Path : /api/issues/:id/tags
Params : id is an existing issue id
Verbs : POST, PUT, DELETE
*/
router.route('/:id/tags')
// Add a new tag for an issue selected by id
	.post(function (req, res, next){
		var word = {
			keyword: req.body.tags
		}

		Issue.findById(req.params.id, function (err, issue) {
			if(err) return next(err);
			issue.tags.push(word);

			issue.save(function (err, issueSaved){
				if(err) return next(err);
				res.json(convertIssue(issueSaved));
			});
		});
	})

// Update a tag selected by id, for an issue selected by id in the request
	.put(function (req, res, next){
		Issue.findById(req.params.id, function (err, issue) {
			if(err) return next(err);
			for (var i = issue.tags.length - 1; i >= 0; i--) {
				if(issue.tags[i]._id == req.body.tagId){
					console.log(req.params.tagId);
					issue.tags[i].keyword = req.body.keyword;
				}
			};

			issue.save(function (err, issueSaved){
				if(err) return next(err);
				res.json(convertIssue(issueSaved));
			});
		});
	})

// Remove an existing tag selected by id, for an issue selected by id in the request
	.delete(function (req, res, next){
		Issue.findById(req.params.id, function (err, issue){
			if(err) return next (err);
			issue.tags.id(req.body.tagId).remove();
			issue.save()
			issue.save(function (err, issueSaved){
				if(err) return next(err);
				res.status(201).json(convertIssue(issueSaved));
			});
		});
	});