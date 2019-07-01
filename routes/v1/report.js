const express = require('express');
const router = express.Router({
	mergeParams: true
});
const Report = require("../../models/report");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// REPORT ENDPOINTS

router.get("/", (req, res) => {
	// Needs to have userID
	req.query.cancelledAt = {$exists: false};
	req.query.deleteAt = {$exists: false};
	Report.find(req.query).populate('patientID').populate({path : 'specialistID', populate : {path : 'specialist.info'}}).sort({createdAt: -1}).exec((err, allReport) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allReport
			})
		}
	});
});

router.get("/:id", (req, res) => {
	Report.findById(req.params.id).populate('patientID').populate('specialistID').exec((err, report) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: Report
			})
		}
	});
});

router.post("/", [
	check('patientID', 'Patient is required.').not().isEmpty(),
    check('specialistID', 'Specialist is required.').not().isEmpty(),
	check('bookingID', 'Booking is required.').not().isEmpty(),
	check('mainComplaint', 'Main Complaint is required.').not().isEmpty(),
    check('impression', 'Impression is required.').not().isEmpty(),
    check('historyAndAssessment', 'History and Assessment is required.').not().isEmpty(),
    check('plan', 'Plan is required.').not().isEmpty(),
    check('medication', 'Medication is required.').not().isEmpty(),
    check('watchOutFor', 'Watch out for is required.').not().isEmpty()
], (req, res) => {
	const newReport = new Report({
        patientID: req.body.patientID,
        specialistID: req.body.specialistID,
		bookingID: req.body.bookingID,
		mainComplaint: req.body.mainComplaint,
        impression: req.body.impression,
        historyAndAssessment: req.body.historyAndAssessment,
        plan: req.body.plan,
        medication: req.body.medication,
        watchOutFor: req.body.watchOutFor
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
		Report.create(newReport, (err, report) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					reportID: report._id,
					message: 'Successfully added report!'
				})
			}
		})
	}
});

router.put('/:id', [
	check('mainComplaint', 'Date is required.').not().isEmpty(),
    check('impression', 'Date is required.').not().isEmpty(),
    check('historyAndAssessment', 'Your Address is required.').not().isEmpty(),
    check('plan', 'Date is required.').not().isEmpty(),
    check('medication', 'Your Address is required.').not().isEmpty(),
    check('watchOutFor', 'Your Address is required.').not().isEmpty()
], (req, res) => {
	var updateReport = {
		mainComplaint: req.body.mainComplaint,
        impression: req.body.impression,
        historyAndAssessment: req.body.historyAndAssessment,
        plan: req.body.plan,
        medication: req.body.medication,
        watchOutFor: req.body.watchOutFor
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
		Report.findByIdAndUpdate(req.params.id, updateReport, (err, updateReport) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated report!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteReport = {
		deleteAt: moment()
	};
	Report.findByIdAndUpdate(req.params.id, deleteReport, (err, deleteReport) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted report!'
			})
		}
	})
});

module.exports = router;