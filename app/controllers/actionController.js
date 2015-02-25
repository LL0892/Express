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

	.post(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: req.body.type,
			content: req.body.content,
			issueId : req.body.issueId
		});

		//safe action
		action.save(function(err, actionSaved) {
			Issue.findById(req.body.issueId, function (err, issue){
				issue.actions.push(actionSaved);
				issue.save(function(err, issueSaved) {
					res.status(201).json(convertAction(actionSaved));
				});
			});	
		});
	})

// GET comment -> done when fetching issues with GET issues
// POST comment -> done here
// Delete comment by Id -> done here
// Put comment by Id -> done here
router.route('/comments/')
	.post(function (req, res, next){
		var action = new Action({
			author: req.body.author,
			type: "post a new comment",
			content: req.body.comment,
			issueId : req.body.issueId
		});

		Issue.findById(req.body.issueId, function(){
			issue.comments.push(req.body.content);
		})
	});

router.route('/comments//:id')
	.put(function (req, res, next){

	})

	.delete(function (req, res, next){

	})