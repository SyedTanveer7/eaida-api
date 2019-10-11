const express = require('express');
const router = express.Router({
	mergeParams: true
});
const Specialist = require("../../models/specialist");
const User = require("../../models/user");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// SPECIALIST ENDPOINTS

router.get("/", (req, res) => {
	// Needs to have userID
	req.query.deleteAt = {$exists: false};
	Specialist.find(req.query).populate({path : 'userID'}).exec((err, allSpecialist) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allSpecialist
				// authData: req.authData
			})
		}
	});
});

router.get("/:id", (req, res) => {
	Specialist.findById(req.params.id).exec((err, specialist) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: specialist
			})
		}
	});
});

router.post("/", [
	check('userID', 'User ID is required.').not().isEmpty(),
	check('consultationFee', 'Patientt is required.').not().isEmpty(),
	check('university', 'Menu is required.').not().isEmpty(),
	check('associatedHospital', 'Date is required.').not().isEmpty(),
	check('experience', 'Experience is required.').not().isEmpty(),
	check('nameTitle', 'Name Title is required.').not().isEmpty(),
	check('licenseNumber', 'License Number is required.').not().isEmpty(),
	check('about', 'About is required.').not().isEmpty(),
	check('languages', 'Languages is required.').not().isEmpty()
], (req, res) => {
	const newSpecialist = new Specialist({
        // Needs to have userID
        userID: req.body.userID,
		consultationFee: req.body.consultationFee,
		university: req.body.university,
		associatedHospital: req.body.associatedHospital,
		experience: req.body.experience,
		nameTitle: req.body.nameTitle,
		licenseNumber: req.body.licenseNumber,
		about: req.body.about,
		languages: req.body.languages
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
		Specialist.create(newSpecialist, (err, specialist) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				User.update({ _id: req.body.userID} , { $set: { 'specialist.info' : specialist._id  } } , (err, updateUser) => {
					if (err) {
						res.json({
							error: true,
							message: err
						})
					} else {
						res.json({
							error: false,
							message: 'Successfully added Specialist Information!'
						})
					}
				})
			}
		})
	}
});

router.put('/:id', [
	check('userID', 'User ID is required.').not().isEmpty(),
	check('consultationFee', 'Patientt is required.').not().isEmpty(),
	check('university', 'Menu is required.').not().isEmpty(),
	check('associatedHospital', 'Date is required.').not().isEmpty(),
	check('experience', 'Experience is required.').not().isEmpty(),
	check('nameTitle', 'Name Title is required.').not().isEmpty(),
	check('licenseNumber', 'License Number is required.').not().isEmpty(),
	check('about', 'About is required.').not().isEmpty(),
	check('languages', 'Languages is required.').not().isEmpty()
], (req, res) => {
	var updateSpecialist = {
        userID: req.body.userID,
		consultationFee: req.body.consultationFee,
		university: req.body.university,
		associatedHospital: req.body.associatedHospital,
		experience: req.body.experience,
		nameTitle: req.body.nameTitle,
		licenseNumber: req.body.licenseNumber,
		about: req.body.about,
		languages: req.body.languages
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
		Specialist.findByIdAndUpdate(req.params.id, updateSpecialist, (err, updateSpecialist) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated Specialist!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteSpecialist = {
		deleteAt: moment()
	};
	Specialist.findByIdAndUpdate(req.params.id, deleteSpecialist, (err, deleteSpecialist) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted Specialist!'
			})
		}
	})
});

module.exports = router;