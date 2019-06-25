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
const multer = require('multer');
const path = require('path');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
var counter = 0;

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
					jwt.sign({
						userID: user[0]._id,
						deviceName: 'vivo1089'
					}, 'secretKey', {
						expiresIn: '7d'
					}, (err, token) => {
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
	req.query.deleteAt = {
		$exists: false
	};
	User.find(req.query).populate({
		path: 'specialist.info'
	}).exec((err, allUser) => {
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


router.post("/profile-picture", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.json({
				error: true,
				message: err.message
			})
			console.log(err);
		} else {
			if (req.file == undefined) {
				res.json({
					error: true,
					message: 'No File Selected!'
				})
				console.log('No File Selected!');
			} else {
				User.findByIdAndUpdate(req.body.userID, {
					imgURL: req.file.filename
				}, function (err, updatedUser) {
					if (err) {
						res.json({
							error: true,
							message: err.message
						})
					} else {
						res.json({
							error: false,
							message: 'Profile picture updated!'
						})
					}
				})
			}
		}
	});
});

router.post("/identification/general", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.json({
				error: true,
				message: err.message
			})
			console.log(err);
		} else {
			if (req.file == undefined) {
				res.json({
					error: true,
					message: 'No File Selected!'
				})
				console.log('No File Selected!');
			} else {
				User.findByIdAndUpdate(req.body.userID, {
					identificationImgURL: {
						general: req.file.filename
					} 
				}, function (err, updatedUser) {
					if (err) {
						res.json({
							error: true,
							message: err.message
						})
					} else {
						res.json({
							error: false,
							message: 'Identification updated!'
						})
					}
				})
			}
		}
	});
});

router.post("/identification/passport", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.json({
				error: true,
				message: err.message
			})
			console.log(err);
		} else {
			if (req.file == undefined) {
				res.json({
					error: true,
					message: 'No File Selected!'
				})
				console.log('No File Selected!');
			} else {
				User.findByIdAndUpdate(req.body.userID, {
					identificationImgURL: {
						passport: req.file.filename
					} 
				}, function (err, updatedUser) {
					if (err) {
						res.json({
							error: true,
							message: err.message
						})
					} else {
						res.json({
							error: false,
							message: 'Identification updated!'
						})
					}
				})
			}
		}
	});
});

router.post("/identification/passport", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.json({
				error: true,
				message: err.message
			})
			console.log(err);
		} else {
			if (req.file == undefined) {
				res.json({
					error: true,
					message: 'No File Selected!'
				})
				console.log('No File Selected!');
			} else {
				User.findByIdAndUpdate(req.body.userID, {
					identificationImgURL: {
						passport: req.file.filename
					} 
				}, function (err, updatedUser) {
					if (err) {
						res.json({
							error: true,
							message: err.message
						})
					} else {
						res.json({
							error: false,
							message: 'Identification updated!'
						})
					}
				})
			}
		}
	});
});

router.post("/identification/national", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.json({
				error: true,
				message: err.message
			})
			console.log(err);
		} else {
			if (req.file == undefined) {
				res.json({
					error: true,
					message: 'No File Selected!'
				})
				console.log('No File Selected!');
			} else {
				User.findByIdAndUpdate(req.body.userID, {
					identificationImgURL: {
						national: req.file.filename
					} 
				}, function (err, updatedUser) {
					if (err) {
						res.json({
							error: true,
							message: err.message
						})
					} else {
						res.json({
							error: false,
							message: 'Identification updated!'
						})
					}
				})
			}
		}
	});
});

router.post('/forgot', function (req, res, next) {

	async.waterfall([
		function (done) {
			crypto.randomBytes(6, function (err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function (token, done) {
			User.findOne({
				email: req.body.email
			}, function (err, user) {
				if (!user) {
					res.json({
						error: true,
						message: 'No account with that email address exists.'
					})
				} else {
					counter++;
					if(counter == 1) {
						User.findOneAndUpdate({email: req.body.email}, {resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 }, function (err, user) {
							if (err) {
								res.json({
									error: true,
									message: err.message
								})
							}
						});
					} else {
						done(err, token, user);
					}
				}
			});
		},
		function (token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'jepoyyy0225@gmail.com',
					pass: '@Patrick22'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'support@jasts.com',
				subject: 'EIADA Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Paste this code into your application to complete the process:\n\n' + token + '\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				res.json({
					error: false,
					message: 'An e-mail has been sent to ' + user.email + ' with further instructions.'
				})
				counter = 0;
				done(err, 'done');
			});
		}
	], function (err) {
		res.json({
			error: true,
			message: err.message
		})
	});
});

router.post('/verify-code', function (req, res) {
	User.findOne({
		resetPasswordToken: req.body.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function (err, user) {
		if (!user) {
			res.json({
				error: true,
				message: 'Password reset token is invalid or has expired.'
			})
		} else {
			res.json({
				error: false,
				message: 'Code verified. Please change your password now.'
			})
		}
	});
});

router.post('/change-password', function (req, res) {
	async.waterfall([
		function (done) {
			User.findOne({
				resetPasswordToken: req.body.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function (err, user) {
				if (!user) {
					res.json({
						error: true,
						message: 'Password reset token is invalid or has expired'
					})
				} else {
					counter++;
					if(counter == 1) {
						User.findOneAndUpdate({resetPasswordToken: req.body.token}, {password: req.body.password}, function (err, user) {
							if (err) {
								res.json({
									error: true,
									message: err.message
								})
							}
						});
					} else {
						done(err, user);
					}
				} 
			});
		},
		function (user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'jepoyyy0225@gmail.com',
					pass: '@Patrick22'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'support@jasts.com',
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
					'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				res.json({
					error: false,
					message: 'Success! Your password has been changed.'
				})
				counter = 0;
				done(err);
			});
		}
	], function (err) {
		res.json({
			error: false,
			message: err.message
		})
	});
});

// OTHER

const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname)
		);
	}
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 100000000000
	},
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
}).single('myImage');

function checkFileType(file, cb) {
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	console.log(file);

	if (extname) {
		return cb(null, true);
	} else {
		cb('Error: Images Only!');
	}
}

module.exports = router;