var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Action = new Schema({
	author: String,
	type: String, //comment or status
	content: String,
	date: {type: Date, default: Date.now },
	issueId: {type: Schema.Types.ObjectId, ref: 'issue'}
});

mongoose.model('Action', Action);