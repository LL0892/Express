var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var Issue = new Schema({
    author: String,
    responsable: String,
  	description: String,
    status: {type: String, default: "created"},
    latitude: Number,
    longitude: Number,
  	updatedOn: {type: Date, default: Date.now },
  	issueType: {type: Schema.Types.ObjectId, ref: 'issueType'}
  });

  Issue.pre('save', function(next){
  	this.updatedOn = new Date();
  	next();
  })

  mongoose.model('Issue', Issue);