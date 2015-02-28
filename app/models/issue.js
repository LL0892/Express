var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  // Comments schema
  var Comments = new Schema({
    author: String,
    body: String,
    date: {type: Date, default: Date.now}
  });

  // Tags schema
  var Tags = new Schema({
    keyword: String
  });

  // Issue schema with embedded Comment schema
  var Issue = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    responsable: {type: String, required: false},
  	description: {type: String, required: true},
    tags: {type: [Tags], required: false, lowercase: true, trim: true},
    status: {type: String, default: "created"},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    createdOn: {type: Date, default: Date.now},
  	updatedOn: {type: Date, required: false},
  	issueType: {type: Schema.Types.ObjectId, ref: 'issueType'},
    comments: {type: [Comments], required: false}
  });

//  Issue.pre('save', function(next){
//  	this.updatedOn = new Date();
//  	next();
//  });

  mongoose.model('Issue', Issue);
