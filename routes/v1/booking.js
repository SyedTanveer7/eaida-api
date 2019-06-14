const express = require('express');
const router = express.Router({
	mergeParams: true
});
const Booking = require("../../models/booking");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// BOOKING ENDPOINTS

router.get("/", (req, res) => {
	// Needs to have userID
	if(typeof req.query.whichStatus != 'undefined' && req.query.whichStatus != '') {
		if(req.query.whichStatus == 'declined') {
			req.query.$and = [ { 'status.label': 'Declined' }, { $or: [ {'status.declineReason': {$exists: false} }, {'status.declineReason': {$exists: true} } ] } ];
		} else if(req.query.whichStatus == 'approved') {
			req.query.$and = [ { 'status.label': 'Approved' }, { 'status.declineReason': {$exists: false} } ];
		} else if(req.query.whichStatus == 'approvedDone') {
			req.query.$or = [ { 'status.label': 'Approved' }, { 'status.label': 'Done' } ];
		} else if(req.query.whichStatus == 'completedCancelledDeclined') {
			req.query.$or = [ { 'status.label': 'Completed' }, { 'status.label': 'Cancelled' }, { 'status.label': 'Declined' } ];
		} else if(req.query.whichStatus == 'noStatusApprovedDone') {
			req.query.$or = [ { 'status.label': 'Approved' }, { 'status.label': 'Done' }, { status: {$exists: false} } ];
		} else if(req.query.whichStatus == 'noStatus') {
			req.query.status = {$exists: false};
		}
		delete req.query.whichStatus;
	}
	req.query.cancelledAt = {$exists: false};
	req.query.deleteAt = {$exists: false};
	Booking.find(req.query).populate('patientID').populate('patientAddressID').populate({path : 'specialistID', populate : {path : 'specialist.info'}}).exec((err, allBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allBooking
			})
		}
	});
});

router.get("/:id", (req, res) => {
	Booking.findById(req.params.id).populate('patientID').populate('patientAddressID').populate('specialistID').exec((err, booking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: booking
			})
		}
	});
});

router.post("/", [
	check('patientID', 'Patientt is required.').not().isEmpty(),
	check('menu', 'Menu is required.').not().isEmpty(),
	check('scheduleDateTime', 'Date is required.').not().isEmpty(),
	check('patientAddressID', 'Your Address is required.').not().isEmpty(),
	check('specialistID', 'Specialist is required.').not().isEmpty()
], (req, res) => {
	const newBooking = new Booking({
		patientID: req.body.patientID,
		menu: req.body.menu,
		scheduleDateTime: moment(req.body.scheduleDateTime).format('MM-DD-YYYY hh:mm:ss'),
		patientAddressID: req.body.patientAddressID,
		specialistID: req.body.specialistID,
		payment: {
			refID: req.body.payment
		}
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
		Booking.create(newBooking, (err, booking) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully booked!'
				})
			}
		})
	}
});

router.put('/:id', [
	check('patientID', 'Patient is required.').not().isEmpty(),
	check('menu', 'Menu is required.').not().isEmpty(),
	check('scheduleDateTime', 'Date is required.').not().isEmpty(),
	check('patientAddressID', 'Your Address is required.').not().isEmpty(),
	check('specialistID', 'Specialist is required.').not().isEmpty()
], (req, res) => {
	var updateBooking = {
		patientID: req.body.patientID,
		menu: req.body.menu,
		scheduleDateTime: moment(req.body.scheduleDateTime).format('MM-DD-YYYY hh:mm'),
		patientAddressID: req.body.patientAddressID,
		specialistID: req.body.specialistID,
		payment: {
			refID: req.body.payment
		}
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
		Booking.findByIdAndUpdate(req.params.id, updateBooking, (err, updateBooking) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated Booking!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteBooking = {
		deleteAt: moment()
	};
	Booking.findByIdAndUpdate(req.params.id, deleteBooking, (err, deleteBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted booking!'
			})
		}
	})
});

// CUSTOM

router.put('/cancel/:id', (req, res) => {
	var cancelBooking = {
		status: {
			label: 'Cancelled',
			triggeredBy: req.body.triggeredBy,
			triggeredAt: moment()
		}
	};
	Booking.findByIdAndUpdate(req.params.id, cancelBooking, (err, cancelBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Booking Cancelled!'
			})
		}
	})
});

router.put('/decline/:id', (req, res) => {
	var declineBooking = {
		status: {
			label: 'Declined',
			triggeredBy: req.body.triggeredBy,
			triggeredAt: moment(),
			declineReason: req.body.declineReason
		}
	};
	Booking.findByIdAndUpdate(req.params.id, declineBooking, (err, declineBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Booking declined! Booking moved to Booking History.'
			})
		}
	})
});

router.put('/accept/:id', (req, res) => {
	var acceptBooking = {
		status: {
			label: 'Approved',
			triggeredBy: req.body.triggeredBy,
			triggeredAt: moment()
		}
	};
	Booking.findByIdAndUpdate(req.params.id, acceptBooking, (err, approveBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Booking approved! Booking moved to Appointments.'
			})
		}
	})
});

router.put('/done/:id', (req, res) => {
	var acceptBooking = {
		status: {
			label: 'Done',
			triggeredBy: req.body.triggeredBy,
			triggeredAt: moment()
		}
	};
	Booking.findByIdAndUpdate(req.params.id, acceptBooking, (err, approveBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Booking Done.'
			})
		}
	})
});

router.put('/complete/:id', (req, res) => {
	var acceptBooking = {
		status: {
			label: 'Completed',
			triggeredBy: req.body.triggeredBy,
			triggeredAt: moment()
		}
	};
	Booking.findByIdAndUpdate(req.params.id, acceptBooking, (err, approveBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Booking completed! Booking moved to History.'
			})
		}
	})
});

router.put('/location/:id', (req, res) => {
	var acceptBooking = {
		$set: { 
			'status.specialistCurrentCoordinates':req.body.coordinates       
		 }
	};
	Booking.findByIdAndUpdate(req.params.id, acceptBooking, (err, updateLocation) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Current location sent.'
			})
		}
	})
});

module.exports = router;