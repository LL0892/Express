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
		content: action.content
	}
}

router.route('/')
	.get(function (req, res, next){
		Action.find(function (err, actions){
			if(err) return next(err);
			res.json(_.map(actions, function (action){
				return convertAction(action);				
			}))
		})
	})

/*	.post(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: req.body.type,
			content: req.body.content,
			issueId : req.body.issueId
		});

		//safe action
		action.save(function (err, actionSaved) {
			Issue.findById(req.body.issueId, function (err, issue){
				issue.actions.push(actionSaved);
				issue.save(function (err, issueSaved) {
					res.status(201).json(convertAction(actionSaved));
				});
			});	
		});
	})*/

router.route('/comments')
	.post(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: "post a new comment",
			content: req.body.comment,
			issueId : req.body.issueId
		});

		var comment = {
			author: req.body.author,
			body: req.body.content
		}

		action.save(function (err, actionSaved){
			if(err) return next(err);
			Issue.findById(req.body.issueId, function (err, issue){
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

	})

	.delete(function (req, res, next){

	})