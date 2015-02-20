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
		issueType: issue.issueType
	}
}

router.route('/')
	.get(function (req, res, next){
		Issue.find(function (err, issues){
			if(err) return next(err);
			res.json(_.map(issues, function (issue){
				return convertIssue(issue);
			}))
		});
	})

	.post(function (req, res, next) {
		var issue = new Issue({
			author: req.body.author,
			responsable: req.body.responsable,
			description: req.body.description,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			issueType: req.body.issueType
		})
	})