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
	req.query.deleteAt = {$exists: false};
	console.log(req.query);
	Booking.find(req.query).populate('patientID').populate('addressID').populate({path : 'specialistID', populate : {path : 'specialist.info'}}).populate({path : 'specialistID', populate : {path : 'specialist.weeklySchedule'}}).sort({createdAt: -1}).exec((err, allBooking) => {
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
	Booking.findById(req.params.id).populate('patientID').populate('addressID').populate('specialistID').exec((err, booking) => {
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
	check('patientID', 'Patient is required.').not().isEmpty(),
	check('accountOwnerName', 'Owner Name is required.').not().isEmpty(),
	check('bookingReason', 'Booking Reason is required.').not().isEmpty(),
	check('patientType', 'Patient Type is required.').not().isEmpty(),
	check('patientName', 'Patient Name is required.').not().isEmpty(),
	check('addressID', 'Address ID is required.').not().isEmpty(),
	check('addressTitle', 'Address Title is required.').not().isEmpty(),
	check('caseName', 'Case Name is required.').not().isEmpty(),
	check('caseCategory', 'Case Category is required.').not().isEmpty(),
	check('specialistID', 'Specialist ID is required.').not().isEmpty(),
	check('specialistName', 'Specialist Name is required.').not().isEmpty(),
	check('bookingDate', 'Booking Date is required.').not().isEmpty()
], (req, res) => {

	var forWho1 = "";
	var forWho2 = "";

	if(req.body.patientType != "Myself") {
		forWho1 = " for your " + req.body.patientType;
		forWho2 = " for his/her " + req.body.patientType;
	}

	const newBooking = new Booking({
		patientID: req.body.patientID,
		bookingReason: req.body.bookingReason,
		patientType: req.body.patientType,
		familyMemberID: req.body.familyMemberID,
		addressID: req.body.addressID,
		addressTitle: req.body.addressTitle,
		caseName: req.body.caseName,
		caseCategory: req.body.caseCategory,
		specialistID: req.body.specialistID,
		bookingDate: moment(req.body.bookingDate).format('MM-DD-YYYY hh:mm:ss'),
		scenario: {
			message1: {
				code: "1",
				description_patient: "You booked " + req.body.specialistName + " on " + moment(req.body.bookingDate).format('MMMM DD') + forWho1 + " because of " + req.body.bookingReason + ".",
				description_specialist: req.body.accountOwnerName + " is asking for booking on " + moment(req.body.bookingDate).format('MMMM DD') + forWho2 + " because of " + req.body.bookingReason + ".",
				trigger: "Patient",
				createdAt: moment()	
			}
		},
		specialistLocation: {
			lat: "14.364938",
			lng: "121.480514",
			createdAt: moment()
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
	check('bookingReason', 'Booking Reason is required.').not().isEmpty(),
	check('patientType', 'Patient Type is required.').not().isEmpty(),
	check('patientLastName', 'Patient Type is required.').not().isEmpty(),
	check('addressID', 'Address ID is required.').not().isEmpty(),
	check('addressTitle', 'Address Title is required.').not().isEmpty(),
	check('caseName', 'Case Name is required.').not().isEmpty(),
	check('caseCategory', 'Case Category is required.').not().isEmpty(),
	check('specialistID', 'Specialist ID is required.').not().isEmpty(),
	check('specialistLastName', 'Specialist Last Name is required.').not().isEmpty(),
	check('bookingDate', 'Booking Date is required.').not().isEmpty()
], (req, res) => {
	var updateBooking = {
		bookingReason: req.body.bookingReason,
		patientType: req.body.patientType,
		familyMemberID: req.body.familyMemberID,
		addressID: req.body.addressID,
		addressTitle: req.body.addressTitle,
		caseName: req.body.caseName,
		caseCategory: req.body.caseCategory,
		specialistID: req.body.specialistID,
		bookingDate: moment(req.body.bookingDate).format('MM-DD-YYYY hh:mm:ss')
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

router.put('/report/:id', (req, res) => {
	var updateBookingReports = {
		reportID: req.body.reportID
	};
	Booking.findByIdAndUpdate(req.params.id, updateBookingReports, (err, updatedBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Booking report updated!'
			})
		}
	})
});

router.put('/scenario/:id', (req, res) => {

	var updateBooking = {};

	var notificationFor;

	if(req.body.trigger == "Patient") {
		notificationFor = "Specialist";
	} else if(req.body.trigger == "Specialist") {
		notificationFor = "Patient";
	}

	if(req.body.sequenceNumber == "1") {
		updateBooking = { 
			$set: {
				notification: notificationFor,
				'scenario.message1': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "2") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message2': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "3") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message3': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "4") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message4': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "5") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message5': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "6") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message6': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "7") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message7': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "8") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message8': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "9") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message9': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "10") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message10': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "11") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message11': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	} else if(req.body.sequenceNumber == "12") {
		updateBooking = {
			$set: {
				notification: notificationFor,
				'scenario.message12': {
					code: req.body.code,
					description_patient: req.body.descriptionPatient,
					description_specialist: req.body.descriptionSpecialist,
					trigger: req.body.trigger,
					createdAt: moment()
				}
			}
		};
	}

	Booking.update({ _id: req.params.id}, updateBooking, (err, updatedBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Booking updated!'
			})
			console.log(updatedBooking);
		}
	})
});

router.put('/payment/:id', (req, res) => {
	var updateBooking = {
		payment: {
			chargeID: req.body.chargeID,
			createdAt: moment()
		}
	};
	Booking.update({ _id: req.params.id}, updateBooking, (err, updatedBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Booking payment updated!'
			})
			console.log(updatedBooking);
		}
	})
});

router.put('/location/:id', (req, res) => {
	var updateBooking = {
		specialistLocation: {
			lat: req.body.lat,
			lng: req.body.lng,
			createdAt: moment()
		}
	};
	Booking.update({ _id: req.params.id}, updateBooking, (err, updatedBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Booking specialist location updated!'
			})
			console.log(updatedBooking);
		}
	})
});

router.put('/notification/:id', (req, res) => {
	var updateBooking = {
		notification: {
			for: req.body.notification
		}
	};
	Booking.update({ _id: req.params.id }, updateBooking, (err, updatedBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Notification has been seen.'
			})
		}
	})
});

module.exports = router;