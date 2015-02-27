var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Action = new Schema({
	author: String,
	type: String, //Type of action (modify/create/remove comments, change status)
	content: String,
	date: {type: Date, default: Date.now },
	issueId: {type: Schema.Types.ObjectId, ref: 'issue'},
	commentId: {type: Schema.Types.ObjectId, ref: 'issue.comments'}
});

mongoose.model('Action', Action);