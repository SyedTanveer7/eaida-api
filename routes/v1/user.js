const express = require('express');
const router = express.Router({
	mergeParams: true
});
const User = require("../../models/user");
const BlacklistedJWT = require("../../models/blacklistedJWT");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// USER SESSION ENDPOINTS

router.post("/session", [
	check('username', 'Username is required.').not().isEmpty(),
	check('password', 'Password is required.').not().isEmpty()
], (req, res) => {
	var errorsMessage = '';
	var errors = validationResult(req);
	var errorsArray = errors.array();
	for (var i = 0; i < errorsArray.length; i++) {
		errorsMessage += JSON.parse(JSON.stringify(errorsArray[i].msg)) + '<br />';
	}
	if (errorsArray.length > 0) {
		res.json({
			error: true,
			message: errorsMessage
		})
	} else {
		User.find({
			$and: [{
				username: req.body.username
			}, {
				password: req.body.password
			}]
		}).exec((err, user) => {
			if (err) {
				res.json({
					error: true,
					message: err.message
				})
			} else {
				if (user.length > 0) {
					console.log(user);
					jwt.sign({userID: user[0]._id, deviceName: 'vivo1089'}, 'secretKey', { expiresIn: '7d' }, (err, token) => {
						res.json({
							error: false,
							userID: user[0]._id,
							userRole: user[0].roles,
							token
						});
					});
				} else {
					res.json({
						error: true,
						message: 'No account is associated with this information.'
					})
				}
			}
		});
	}
});

// USER ENDPOINTS

router.get("/", (req, res) => {
	req.query.deleteAt = {$exists: false};
	User.find(req.query).populate({path : 'specialist.info'}).exec((err, allUser) => {
		if (err) {
			res.json({
                error: true,
				message: err.message
			})
		} else {
			res.json({
				error: false,
				message: allUser
				// authData: req.authData
			})
		}
	});
});

router.get("/:id", middleware.setToken, middleware.verifyToken, (req, res) => {
	User.findById(req.params.id).exec((err, user) => {
		if (err) {
			res.json({
                error: true,
				message: err.message
			})
		} else {
			res.json({
				error: false,
				message: user
				// authData: req.authData
			})
		}
	});
});

router.post("/", [
	check('username', 'Username is required.').not().isEmpty(),
	check('password', 'Password is required.').not().isEmpty(),
	check('email', 'Email is required.').not().isEmpty(),
	check('firstName', 'First name is required.').not().isEmpty(),
	check('lastName', 'Last name is required.').not().isEmpty(),
	check('middleName', 'Middle name is required.').not().isEmpty(),
	check('roles', 'Role is required.').not().isEmpty()
], (req, res) => {
	const newUser = new User({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		middleName: req.body.middleName,
		roles: req.body.roles
	});

	var errorsMessage = '';
	var errors = validationResult(req);
	var errorsArray = errors.array();
	for (var i = 0; i < errorsArray.length; i++) {
		errorsMessage += JSON.parse(JSON.stringify(errorsArray[i].msg)) + '<br />';
	}

	if (errorsArray.length > 0) {
		res.json({
			error: true,
			message: errorsMessage
		})
	} else {
		User.create(newUser, (err, user) => {
			if (err) {
				res.json({
					error: true,
					message: err.message
				})
			} else {
				res.json({
                    error: false,
                    message: 'Successfully registered!'
                })
			}
		})
	}
});

router.put('/:id', [
	check('username', 'Username is required.').not().isEmpty(),
	check('password', 'Password is required.').not().isEmpty(),
	check('email', 'Email is required.').not().isEmpty(),
	check('firstName', 'First name is required.').not().isEmpty(),
	check('lastName', 'Last name is required.').not().isEmpty(),
	check('middleName', 'Middle name is required.').not().isEmpty()
], (req, res) => {
	var updateUser = {
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		middleName: req.body.middleName
	};
	var errorsMessage = '';
	var errors = validationResult(req);
	var errorsArray = errors.array();
	for (var i = 0; i < errorsArray.length; i++) {
		errorsMessage += JSON.parse(JSON.stringify(errorsArray[i].msg)) + '<br />';
	}
	if (errorsArray.length > 0) {
		res.json({
			error: true,
			message: errorsMessage
		})
	} else {
		User.findByIdAndUpdate(req.params.id, updateUser, (err, updateUser) => {
			if (err) {
				res.json({
					error: true,
					message: err.message
				})
			} else {
				res.json({
                    error: false,
                    message: 'Successfully updated Account!'
                })
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteUser = {
		deleteAt: moment()
	};
	User.findByIdAndUpdate(req.params.id, deleteUser, (err, deleteUser) => {
		if (err) {
			res.json({
				error: true,
				message: err.message
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted Account!'
			})
		}
	})
});

module.exports = router;