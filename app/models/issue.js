var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  // Comment schema
  var Comments = new Schema({
    author: String,
    body: String,
    date: {type: Date, default: Date.now}
  });

  // Issue schema with embedded Comment schema
  var Issue = new Schema({
    author: {type: String, required: true},
    responsable: {type: String, required: false},
  	description: {type: String, required: true},
    status: {type: String, default: "created"},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
  	updatedOn: {type: Date, default: Date.now },
  	issueType: {type: Schema.Types.ObjectId, ref: 'issueType'},
    comments: [Comments]
  });

  Issue.pre('save', function(next){
  	this.updatedOn = new Date();
  	next();
  });

  //mongoose.model('Comments', Comments);
  mongoose.model('Issue', Issue);