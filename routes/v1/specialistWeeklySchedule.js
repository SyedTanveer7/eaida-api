const express = require('express');
const router = express.Router({
	mergeParams: true
});
const SpecialistWeeklySchedule = require("../../models/specialistWeeklySchedule");
const User = require("../../models/user");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// SPECIALIST WEEKLY SCHEDULE ENDPOINTS

router.get("/", (req, res) => {
	if(typeof req.query.weekDay !== 'undefined') {
		if(req.query.weekDay == "Monday") {
			req.query = {
				'monday.status': 'Available'
			}
		} else if(req.query.weekDay == "Tuesday") {
			req.query = {
				'tuesday.status': 'Available'
			}
		} else if(req.query.weekDay == "Wednesday") {
			req.query = {
				'wednesday.status': 'Available'
			}
		} else if(req.query.weekDay == "Thursday") {
			req.query = {
				'thursday.status': 'Available'
			}
		} else if(req.query.weekDay == "Friday") {
			req.query = {
				'friday.status': 'Available'
			}
		} else if(req.query.weekDay == "Saturday") {
			req.query = {
				'saturday.status': 'Available'
			}
		} else if(req.query.weekDay == "Sunday") {
			req.query = {
				'sunday.status': 'Available'
			}
		}
		delete req.query.weekDay;
	}
	// Needs to have userID
	req.query.deleteAt = {$exists: false};
	console.log(req.query);
	SpecialistWeeklySchedule.find(req.query).populate({path : 'specialistID', populate : {path : 'specialist.info'}}).sort({createdAt: -1}).exec((err, allSpecialistWeeklySchedule) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allSpecialistWeeklySchedule
			})
		}
	});
});

router.get("/:id", (req, res) => {
	SpecialistWeeklySchedule.findById(req.params.id).populate('specialistID').exec((err, specialistWeeklySchedule) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: specialistWeeklySchedule
			})
		}
	});
});

router.post("/", [
	check('specialistID', 'Specialist is required.').not().isEmpty(),
    check('weekDay', 'Weekly Day is required.').not().isEmpty(),
	check('status', 'Status is required.').not().isEmpty(),
	check('bookingCount', 'Book Count is required.').not().isEmpty()
], (req, res) => {

	var newSpecialistWeeklySchedule;

	if(req.body.weekDay == "Monday") {
		newSpecialistWeeklySchedule = new SpecialistWeeklySchedule({
			specialistID: req.body.specialistID,
			monday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		});
	} else if(req.body.weekDay == "Tuesday") {
		newSpecialistWeeklySchedule = new SpecialistWeeklySchedule({
			specialistID: req.body.specialistID,
			tuesday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		});
	} else if(req.body.weekDay == "Wednesday") {
		newSpecialistWeeklySchedule = new SpecialistWeeklySchedule({
			specialistID: req.body.specialistID,
			wednesday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		});
	} else if(req.body.weekDay == "Thursday") {
		newSpecialistWeeklySchedule = new SpecialistWeeklySchedule({
			specialistID: req.body.specialistID,
			thursday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		});
	} else if(req.body.weekDay == "Friday") {
		newSpecialistWeeklySchedule = new SpecialistWeeklySchedule({
			specialistID: req.body.specialistID,
			friday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		});
	} else if(req.body.weekDay == "Saturday") {
		newSpecialistWeeklySchedule = new SpecialistWeeklySchedule({
			specialistID: req.body.specialistID,
			saturday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		});
	} else if(req.body.weekDay == "Sunday") {
		newSpecialistWeeklySchedule = new SpecialistWeeklySchedule({
			specialistID: req.body.specialistID,
			sunday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		});
	}

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
		SpecialistWeeklySchedule.create(newSpecialistWeeklySchedule, (err, specialistWeeklySchedule) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				User.updateOne({ _id: req.body.specialistID} , { $set: { 'specialist.weeklySchedule' : specialistWeeklySchedule._id  } }, {upsert: true} , (err, updateUser) => {
					if (err) {
						res.json({
							error: true,
							message: err
						})
					} else {
						res.json({
							error: false,
							message: 'Successfully added Specialist Weekly Schedule!'
						})
					}
				})
			}
		})
		
	}
});

router.put('/:id', [
	check('specialistID', 'Specialist is required.').not().isEmpty(),
    check('weekDay', 'Weekly Day is required.').not().isEmpty(),
	check('status', 'Status is required.').not().isEmpty(),
	check('bookingCount', 'Book Count is required.').not().isEmpty()
], (req, res) => {
	var updateSpecialistWeeklySchedule;

	if(req.body.weekDay == "Monday") {
		updateSpecialistWeeklySchedule = {
			monday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		};
	} else if(req.body.weekDay == "Tuesday") {
		updateSpecialistWeeklySchedule = {
			tuesday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		};
	} else if(req.body.weekDay == "Wednesday") {
		updateSpecialistWeeklySchedule = {
			wednesday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		};
	} else if(req.body.weekDay == "Thursday") {
		updateSpecialistWeeklySchedule = {
			thursday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		};
	} else if(req.body.weekDay == "Friday") {
		updateSpecialistWeeklySchedule = {
			friday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		};
	} else if(req.body.weekDay == "Saturday") {
		updateSpecialistWeeklySchedule = {
			saturday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		};
	} else if(req.body.weekDay == "Sunday") {
		updateSpecialistWeeklySchedule = {
			sunday: {
				status: req.body.status,
				bookingCount: req.body.bookingCount
			}
		};
	}
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
		SpecialistWeeklySchedule.findByIdAndUpdate(req.params.id, updateSpecialistWeeklySchedule, (err, updatedSpecialistWeeklySchedule) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated Specialist Weekly Schedule!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteSpecialistWeeklySchedule = {
		deleteAt: moment()
	};
	SpecialistWeeklySchedule.findByIdAndUpdate(req.params.id, deleteSpecialistWeeklySchedule, (err, deletedSpecialistWeeklySchedule) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted Specialist Weekly Schedule!'
			})
		}
	})
});

module.exports = router;