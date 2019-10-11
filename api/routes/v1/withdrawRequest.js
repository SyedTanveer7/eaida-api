const express = require('express');
const router = express.Router({
	mergeParams: true
});
const WithdrawRequest = require("../../models/withdrawRequest");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// CARD DETAILS ENDPOINTS

router.get("/", (req, res) => {

	if(typeof req.query.withdrawRequest !== 'undefined') {
		if(req.query.withdrawRequest == "all") {

		} else if(req.query.withdrawRequest == "today") {
			req.query.createdAt = {$gte: new Date(new Date() - 1 * 60 * 60 * 24 * 1000)}
		} else if(req.query.withdrawRequest == "week") {
			req.query.createdAt = {$gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)}
		} else if(req.query.withdrawRequest == "month") {
			req.query.createdAt = {$gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000)}
		} 
		delete req.query.withdrawRequest;
	}

	req.query.deleteAt = {$exists: false};
	WithdrawRequest.find(req.query).populate('specialistID').populate('cardID').sort({createdAt: -1}).exec((err, allWithdrawRequest) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allWithdrawRequest
			})

			console.log(allWithdrawRequest);
		}
	});
});

router.get("/:id", (req, res) => {
	WithdrawRequest.findById(req.params.id).populate('specialistID').exec((err, withdrawRequest) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: withdrawRequest
			})
		}
	});
});

router.post("/", [
	check('specialistID', 'specialist is required.').not().isEmpty(),
	check('cardID', 'Card Details is required.').not().isEmpty(),
	check('amount', 'Amount is required.').not().isEmpty()
], (req, res) => {
	const newWithdrawRequest = new WithdrawRequest({
		specialistID: req.body.specialistID,
		cardID: req.body.cardID,
		amount: req.body.amount
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
		WithdrawRequest.create(newWithdrawRequest, (err, WithdrawRequest) => {
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
	check('specialistID', 'specialist is required.').not().isEmpty(),
	check('cardID', 'Card Details is required.').not().isEmpty(),
	check('amount', 'Amount is required.').not().isEmpty()
], (req, res) => {
	var updateWithdrawRequest = {
		specialistID: req.body.specialistID,
		cardID: req.body.cardID,
		amount: req.body.amount
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
		WithdrawRequest.findByIdAndUpdate(req.params.id, updateWithdrawRequest, (err, updateWithdrawRequest) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated withdraw request!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteWithdrawRequest = {
		deleteAt: moment()
	};
	WithdrawRequest.findByIdAndUpdate(req.params.id, deleteWithdrawRequest, (err, deleteWithdrawRequest) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted withdraw request!'
			})
		}
	})
});

router.put('/approve/:id', (req, res) => {
	if(req.body.status == "approve") {
		var updateUser = {
			approvedAt: moment(),
			$unset: { declineReason: "", declinedAt: "" }
		};
	} else if(req.body.status == "disapprove") {
		var updateUser = {
			$unset: { approvedAt: "" }
		};
	}
	WithdrawRequest.update({ _id: req.params.id }, updateUser, (err, updatedUser) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Successfully approved.'
			})
		}
	})
});

router.put('/decline/:id', (req, res) => {
	var updateUser = {
		declineReason: req.body.declineReason,
		$unset: { approvedAt: "" },
		declinedAt: moment()
	};
	WithdrawRequest.update({ _id: req.params.id }, updateUser, (err, updatedUser) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Successfully declined.'
			})
		}
	})
});

module.exports = router;