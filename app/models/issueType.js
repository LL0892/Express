var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var IssueTypeSchema = new Schema({
  	shortName: String,
  	description: String
  });

  mongoose.model('IssueType', IssueTypeSchema);