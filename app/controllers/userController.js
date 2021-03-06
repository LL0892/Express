var
	_ = require('underscore'),
	express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/api/users', router);
};

function convertMongoUser(user) {
	//return user.toObject({ transform: true })
	return {
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		phone: user.phone,
		roles: user.roles
	}
}

/*
Get all users, and create a new user
Path : /api/users/
Verbs : GET & POST
*/
router.route('/')
// Get all users
	.get(function(req, res, next) {
		User.find(function (err, users) {
		  if (err) return next(err);
		  res.json(_.map(users, function(user) {
				return convertMongoUser(user);
			}));
		});
	})

// Create a new user
	.post(function (req, res, next) {
		var user = new User({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			phone: req.body.phone,
			roles: req.body.roles
		});

		user.save(function(err, userSaved) {
			res.status(201).json(convertMongoUser(userSaved));
		});
	});

/*
Get a specific user, modify an existing user, and delete a existing user
Path : /api/users/:id
Params : id is an existing user id
Verbs : GET, PUT, DELETE
*/
router.route('/:id')
// Get user by id
	.get(function(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			res.json(convertMongoUser(user));
		});
	})

// Update user by id
	.put(function(req, res, next) {
		User.findById(req.params.id, function(err, user) {
			user.firstname = req.body.firstname;
			user.lastname = req.body.lastname;
			user.phone = req.body.phone;
			user.roles = req.body.roles;

			user.save(function(err, userSaved) {
				res.json(convertMongoUser(userSaved));
			});
		});
	})

// Delete user by id
	.delete(function(req, res, next) {
		User.findByIdAndRemove(req.params.id, function(err) {
			res.status(204).end();
		});
	});