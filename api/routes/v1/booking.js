const express = require('express');
const router = express.Router({
	mergeParams: true
});
const Reviews = require("../../models/reviews");
const Report = require("../../models/report");
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
	if(typeof req.query.activeCount !== 'undefined') {
		if(req.query.activeCount == "all") {
			req.query.$or = [ {reportID: {$exists: false} }, {reviewID: {$exists: false}} ]
		}
		delete req.query.activeCount;
	}

	if(typeof req.query.removedAt !== 'undefined') {
		if(req.query.removedAt == "booking") {
			delete req.query.removedAt;
			if(typeof req.query.patientID !== 'undefined') {
				req.query = {'removedAt.patient': {$exists: false} }
			} else if(typeof req.query.specialistID !== 'undefined') {
				req.query = {'removedAt.specialist': {$exists: false} }
			}
		} else if(req.query.removedAt == "history") {
			delete req.query.removedAt;
			if(typeof req.query.patientID !== 'undefined') {
				req.query = {'removedAt.patient': {$exists: true} }
			} else if(typeof req.query.specialistID !== 'undefined') {
				req.query = {'removedAt.specialist': {$exists: true} }
			}
		}
	}

	if(typeof req.query.bookingHistory !== 'undefined') {
		if(req.query.bookingHistory == "all") {
			
		} else if(req.query.bookingHistory == "today") {
			req.query.createdAt = { $gte: new Date(new Date() - 1 * 60 * 60 * 24 * 1000) }
		} else if(req.query.bookingHistory == "week") {
			req.query.createdAt = { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) }
		} else if(req.query.bookingHistory == "month") {
			req.query.createdAt = { $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) }
		}
		delete req.query.bookingHistory;
	}

	if(typeof req.query.paymentHistory !== 'undefined') {
		if(req.query.paymentHistory == "all") {
			req.query.payment = {$exists: true};
		} else if(req.query.paymentHistory == "today") {
			req.query.$and = [{payment: {$exists: true}}, {createdAt: {$gte: new Date(new Date() - 1 * 60 * 60 * 24 * 1000)}}]
		} else if(req.query.paymentHistory == "week") {
			req.query.$and = [{payment: {$exists: true}}, {createdAt: {$gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)}}]
		} else if(req.query.paymentHistory == "month") {
			req.query.$and = [{payment: {$exists: true}}, {createdAt: {$gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000)}}]
		} 
		delete req.query.paymentHistory;
	}
	
	if(typeof req.query.weeklyTransactionCount !== 'undefined') {
		if(req.query.weeklyTransactionCount == "all") {
			req.query.createdAt = { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) }
		}
		delete req.query.weeklyTransactionCount;
	}

	if(typeof req.query.monthlyTransactionCount !== 'undefined') {
		if(req.query.monthlyTransactionCount == "all") {
			req.query.createdAt = { $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000) }
		}
		delete req.query.monthlyTransactionCount;
	}

	if(typeof req.query.textQuery !== 'undefined') {
		req.query.$or = [ {'patientID.firstName': {$regex : req.query.textQuery} }, {'patientID.middleName': {$regex : req.query.textQuery} }, {'patientID.firstName': {$regex : req.query.textQuery} } ]
		delete req.query.textQuery;
	}

	req.query.deleteAt = {$exists: false};
	console.log(req.query);
	Booking.find(req.query).populate('reviewID').populate('reportID').populate('patientID').populate('addressID').populate({path : 'specialistID', populate : {path : 'specialist.info'}}).populate({path : 'specialistID', populate : {path : 'specialist.weeklySchedule'}}).sort({createdAt: -1}).exec((err, allBooking) => {
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
		notification: {
			for: "Specialist",
			message: "You have new booking request from " + req.body.accountOwnerName + ".",
			
			createdAt: moment()
		},
		scenario: {
			message1: {
				code: "1",
				description_patient: "You booked " + req.body.specialistName + " on " + moment(req.body.bookingDate).format('MMMM DD') + forWho1 + " because of " + req.body.bookingReason + ".",
				description_specialist: req.body.accountOwnerName + " is asking for booking on " + moment(req.body.bookingDate).format('MMMM DD') + forWho2 + " because of " + req.body.bookingReason + ".",
				trigger: "Patient",
				createdAt: moment()	
			}
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
		cancelledAt: moment()
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
			message: 'Booking cancelled.'
			})
		}
	})
});

router.put('/decline/:id', (req, res) => {
	var declineBooking = {
		declinedAt: moment()
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
				message: 'Booking declined.'
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
				message: 'Booking done.'
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
	var location = {
		$set: { 
			'specialistLocation.lat': req.body.lat,
			'specialistLocation.lng': req.body.lng,
			createdAt: moment() 
		 }
	};
	Booking.findByIdAndUpdate(req.params.id, location, (err, updateLocation) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Current location has been shared.'
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

router.put('/review/:id', (req, res) => {
	var updateBookingReviews = {
		reviewID: req.body.reviewID
	};
	Booking.findByIdAndUpdate(req.params.id, updateBookingReviews, (err, updatedBooking) => {
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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
				notification: {
					for: notificationFor,
					message: req.body.notificationMessage,
					createdAt: moment()
				},
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

router.get('/search/:search', (req, res) => {
	Booking.aggregate([

		// Join with user_info table
		{
			$lookup: {
				from: "User", // other table name
				localField: "patientID", // name of users table field
				foreignField: "_id", // name of userinfo table field
				as: "user" // alias for userinfo table
			}
		},
		{
			$unwind: "$user"
		}, // $unwind used for getting data in object or for one record only
		{ 
			$match: { 'User.firstName': { $eq: req.params.search } }
		}
	]).exec((err, result) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: result
			})
		};
	});
});

router.put('/remove/:id', (req, res) => {
	var updateBooking;
	if(req.body.role == "Patient") {
		updateBooking = {
			removedAt: {
				patient: moment()
			}
		};
	} else {
		updateBooking = {
			removedAt: {
				specialist: moment()
			}
		};
	}

	Booking.findByIdAndUpdate(req.params.id, updateBooking, (err, updatedBooking) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
			error: false,
			message: 'Booking report remove!'
			})
		}
	})
});


module.exports = router;