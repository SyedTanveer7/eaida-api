const express = require('express');
const router = express.Router({
	mergeParams: true
});
const Reviews = require("../../models/reviews");
const BlacklistedJWT = require("../../models/blacklistedJWT");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// REVIEWS ENDPOINTS

router.get("/", (req, res) => {
	// Needs to have userID
	BlacklistedJWT.find({}).exec((err, allBlacklistedJWT) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allBlacklistedJWT
				// authData: req.authData
			})
		}
	});
});

router.get("/:id", (req, res) => {
	BlacklistedJWT.findById(req.params.id).exec((err, blacklistedJWT) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: blacklistedJWT
			})
		}
	});
});

router.post("/", middleware.setToken, middleware.verifyToken, [
	check('userID', 'User ID is required.').not().isEmpty(),
	check('token', 'Token is required.').not().isEmpty()
], (req, res) => {
	const newBlacklistedJWT = new BlacklistedJWT({
		userID: req.body.userID,
		token: req.body.token
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
		BlacklistedJWT.create(newBlacklistedJWT, (err, blacklistedJWT) => {
			if (err) {
				res.json({
					error: true,
					message: err.message
				})
			} else {
				res.json({
                    error: false,
                    message: 'Successfully blacklisted JWT token!'
                })
			}
		})
	}
});

router.put('/:id', [
	check('userID', 'User ID is required.').not().isEmpty(),
	check('token', 'Token is required.').not().isEmpty()
], (req, res) => {
	var updateBlacklistedJWT = {
		userID: req.body.userID,
		token: req.body.token
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
		BlacklistedJWT.findByIdAndUpdate(req.params.id, updateBlacklistedJWT, (err, updateBlacklistedJWT) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated blacklisted JWT token!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var daleteBlacklistedJWT = {
		deleteAt: moment()
	};
	BlacklistedJWT.findByIdAndUpdate(req.params.id, daleteBlacklistedJWT, (err, daleteBlacklistedJWT) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted blacklisted JWT token!'
			})
		}
	})
});

// CUSTOM ENDPOINTS

router.get("/search/query", middleware.setToken, middleware.verifyToken, (req, res) => {
	BlacklistedJWT.find(req.query).exec((err, blacklistedJWT) => {
		if (err) {
			res.json({
                error: true,
				message: err.message
			})
		} else {
			res.json({
				error: false,
				resultCount: blacklistedJWT.length,
				message: blacklistedJWT
			})
		}
	});
});


module.exports = router;