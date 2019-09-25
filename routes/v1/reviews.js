const express = require('express');
const router = express.Router({
	mergeParams: true
});
const Reviews = require("../../models/reviews");
const User = require("../../models/user");
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
	req.query.deleteAt = {$exists: false};
	Reviews.find(req.query).populate('patientID').exec((err, allReviews) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allReviews
				// authData: req.authData
			})
		}
	});
});

router.get("/:id", (req, res) => {
	Reviews.findById(req.params.id).exec((err, reviews) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: reviews
			})
		}
	});
});

router.post("/", [
	check('patientID', 'Patient is required.').not().isEmpty(),
	check('specialistID', 'Specialist is required.').not().isEmpty(),
	check('bookingID', 'Booking is required.').not().isEmpty(),
	check('message', 'Message is required.').not().isEmpty(),
	check('starCount', 'Stars is required.').not().isEmpty()
], (req, res) => {
	const newReviews = new Reviews({
		// Needs to have userID
		patientID: req.body.patientID,
		specialistID: req.body.specialistID,
		bookingID: req.body.bookingID,
		message: req.body.message,
		starCount: req.body.starCount
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
		Reviews.create(newReviews, (err, reviews) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully added new Review!',
					reviewID: reviews._id
				})
			}
		})
	}
});

router.put('/:id', [
	check('patientID', 'Patient is required.').not().isEmpty(),
	check('specialistID', 'Specialist is required.').not().isEmpty(),
	check('bookingID', 'Booking is required.').not().isEmpty(),
	check('message', 'Message is required.').not().isEmpty(),
	check('starCount', 'Stars is required.').not().isEmpty()
], (req, res) => {
	var updateReviews = {
		patientID: req.body.patientID,
		specialistID: req.body.specialistID,
		bookingID: req.body.bookingID,
		message: req.body.message,
		starCount: req.body.starCount
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
		Reviews.findByIdAndUpdate(req.params.id, updateReviews, (err, updateReviews) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated Reviews!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteReviews = {
		deleteAt: moment()
	};
	Reviews.findByIdAndUpdate(req.params.id, deleteReviews, (err, deleteReviews) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted Reviews!'
			})
		}
	})
});

// CALCULATE REVIEW STARS ENDPOINTS

router.put('/calculate/:id', (req, res) => {
	let starTotal = 0.0;
	let starCount;
	Reviews.find({ specialistID: req.params.id }).exec(function(err, allReviews) {
		if(err) {
			res.json({
				error: true,
				message: err.message
			})
		} else {
			let reviewCount;
			allReviews.forEach((reviews) => {
				// console.log(parseFloat(reviews.starCount));
				starTotal += parseFloat(reviews.starCount);
			})
			reviewCount = allReviews.length;
			starCount = starTotal/reviewCount;
			User.update({ _id: req.params.id} , { $set: { 'specialist.reviewStarCount' : starCount } } , (err, updateUser) => {
				if (err) {
					res.json({
						error: true,
						message: err
					})
				} else {
					res.json({
						error: false,
						message: 'Successfully updated Specialist Review Count!'
					})
				}
			})
		}
	});
});


module.exports = router;