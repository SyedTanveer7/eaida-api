const express = require('express');
const router = express.Router({
	mergeParams: true
});
const CardDetails = require("../../models/cardDetails");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// CARD DETAILS ENDPOINTS

router.get("/", (req, res) => {
	req.query.cancelledAt = {$exists: false};
	req.query.deleteAt = {$exists: false};
	CardDetails.find(req.query).populate('patientID').sort({createdAt: -1}).exec((err, allCardDetails) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allCardDetails
			})

			console.log(allCardDetails);
		}
	});
});

router.get("/:id", (req, res) => {
	CardDetails.findById(req.params.id).populate('patientID').exec((err, cardDetails) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: cardDetails
			})
		}
	});
});

router.post("/", [
	check('patientID', 'Patient is required.').not().isEmpty(),
	check('cardHolderName', 'CardDetails Reason is required.').not().isEmpty(),
	check('cardNumber', 'Patient Type is required.').not().isEmpty(),
	check('expiryDate', 'Address ID is required.').not().isEmpty(),
	check('cvc', 'Address Title is required.').not().isEmpty()
], (req, res) => {
	const newCardDetails = new CardDetails({
		patientID: req.body.patientID,
		cardHolderName: req.body.cardHolderName,
		cardNumber: req.body.cardNumber,
		expiryDate: req.body.expiryDate,
		cvc: req.body.cvc
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
		CardDetails.create(newCardDetails, (err, cardDetails) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully added!'
				})
			}
		})
	}
});

router.put('/:id', [
	check('cardHolderName', 'CardDetails Reason is required.').not().isEmpty(),
	check('cardNumber', 'Patient Type is required.').not().isEmpty(),
	check('expiryDate', 'Address ID is required.').not().isEmpty(),
	check('cvc', 'Address Title is required.').not().isEmpty()
], (req, res) => {
	var updateCardDetails = {
		cardHolderName: req.body.cardHolderName,
		cardNumber: req.body.cardNumber,
		expiryDate: req.body.expiryDate,
		cvc: req.body.cvc
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
		CardDetails.findByIdAndUpdate(req.params.id, updateCardDetails, (err, updateCardDetails) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated Card Details!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteCardDetails = {
		deleteAt: moment()
	};
	CardDetails.findByIdAndUpdate(req.params.id, deleteCardDetails, (err, deleteCardDetails) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted Card Details!'
			})
		}
	})
});

module.exports = router;