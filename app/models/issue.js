var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var Issue = new Schema({
  	description: String,
  	updatedOn: {type: Date, default: Date.now },
  	// ...
  	issueType: {type: Schema.Types.ObjectId, ref: 'issueType'}
  });

  Issue.pre('save', function(next){
  	this.updatedOn = new Date();
  	next();
  })

  mongoose.model('Issue', Issue);