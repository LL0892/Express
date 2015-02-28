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

/*
Get all existing actions
Path : /api/actions/
Verbs : GET
*/
router.route('/')
// Get all actions
	.get(function (req, res, next){
		Action.find(function (err, actions){
			if(err) return next(err);
			res.json(_.map(actions, function (action){
				return convertAction(action);				
			}))
		})
	});

/*
Create a new comment, linked to a existing issue, create action log
Path : /api/actions/comments/
Verbs : POST
*/
router.route('/comments')
// Create a new comment
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

/*
Modify or remove an existing comment, create action log
Path : /api/actions/comments/:id
Params : id is an existing issue id
Verbs : PUT & DELETE
*/
router.route('/comments/:id')
// Modify an existing comment by issue id (comment id is in request body)
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

// Delete an existing comment  by issue id (comment id is in request body)
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
				});
			});
		});
	});

/*
Change the status of the selected issue, create action log
Path : /api/actions/status
Verbs : PUT
*/
router.route('/status')
// Update the issue's status
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
				});
			});
		});
	});

/*
Change the responsable of the selected issue, create action log
Path : /api/actions/responsable
Verbs : PUT
*/
router.route('/responsable')
// Update the issue's responsable
	.put(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: "Change the "+req.body.issueId+" issue responsable to "+req.body.content,
			content: req.body.content,
			issueId : req.body.issueId
		});

		action.save(function (err, actionSaved){
			if(err) return next(err);
			Issue.findById(req.body.issueId, function (err, issue){
				if(err) return next(err);
				issue.responsable = req.body.content;
				issue.save(function (err, issueSaved){
					if(err) return next(err);
					res.status(201).json(convertAction(actionSaved));
				});
			});
		});
	});