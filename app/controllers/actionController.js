var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Action = mongoose.model('Action'),
  Issue = mongoose.model('Issue');

 module.exports = function (app) {
  app.use('/api/actions', router);
};

function convertAction (action){
	return{
		id: action.id,
		author: action.author,
		type: action.type,
		content: action.content,
		issueId: action.issueId,
		commentId: action.commentId
	}
}

// GET all actions
router.route('/')
	.get(function (req, res, next){
		Action.find(function (err, actions){
			if(err) return next(err);
			res.json(_.map(actions, function (action){
				return convertAction(action);				
			}))
		})
	});

// Actions for comments
router.route('/comments')
	.post(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: "Create a new comment",
			content: req.body.content,
			issueId : req.body.issueId
		});

		var comment = {
			author: req.body.author,
			body: req.body.content
		}

		action.save(function (err, actionSaved){
			if(err) return next(err);
			Issue.findById(req.body.issueId, function (err, issue){
				if(err) return next(err);
				issue.comments.push(comment);
				issue.save(function (err, issueSaved){
					if(err) return next(err);
					res.status(201).json(convertAction(actionSaved));
				});
			});
		});
	});

router.route('/comments/:id')
	.put(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: "Modify an existing comment",
			content: req.body.content,
			issueId : req.body.issueId,
			commentId : req.body.commentId
		});

		action.save(function (err, actionSaved){
			if(err) return next(err);
			Issue.findById(req.params.id, function (err, issue){
				if(err) return next(err);
				for (var i = issue.comments.length - 1; i >= 0; i--) {
					// modify comment's body
					if(issue.comments[i]._id == req.body.commentId){
						issue.comments[i].body = req.body.content;
					}
					// save the issue with comment modified and return the saved action
					issue.save(function (err, issueSaved){
						if(err) return next(err);
						res.status(201).json(convertAction(actionSaved));
					});
				}
			});
		});
	})

	.delete(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: "Remove an existing comment",
			issueId : req.body.issueId,
			commentId : req.body.commentId
		});

		action.save(function (err, actionSaved){
			Issue.findById(req.params.id, function (err, issue){
				if(err) return next(err);
				issue.comments.id(req.body.commentId).remove();
				issue.save(function (err, issueSaved){
					if(err) return next(err);
					res.status(201).json(convertAction(actionSaved));
				})
			});
		});
	});

// Actions for status
router.route('/status')
	.put(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: "Change the "+req.body.issueId+" issue status to "+req.body.content,
			content: req.body.content,
			issueId : req.body.issueId
		});

		action.save(function (err, actionSaved){
			if(err) return next(err);
			Issue.findById(req.body.issueId, function (err, issue){
				if(err) return next(err);
				issue.status = req.body.content;
				issue.save(function (err, issueSaved){
					if(err) return next(err);
					res.status(201).json(convertAction(actionSaved));
				})
			});
		});
	});