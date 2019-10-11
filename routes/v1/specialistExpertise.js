const express = require('express');
const router = express.Router({
	mergeParams: true
});
const SpecialistExpertise = require("../../models/specialistExpertise");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// SPECIALIST EXPERTISE ENDPOINTS

router.get("/", (req, res) => {
	// Needs to have userID
	req.query.deleteAt = {$exists: false};
	SpecialistExpertise.find(req.query).populate('specialistID').populate({path : 'specialistID', populate : {path : 'specialist.info'}}).populate({path : 'specialistID', populate : {path : 'specialist.weeklySchedule'}}).sort({createdAt: -1}).exec((err, allSpecialistExpertise) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allSpecialistExpertise
			})

		}
	});
});

router.get("/:id", (req, res) => {
	SpecialistExpertise.findById(req.params.id).populate('patientID').populate('specialistID').exec((err, specialistExpertise) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: specialistExpertise
			})
		}
	});
});

router.post("/", [
	check('specialistID', 'Specialist is required.').not().isEmpty(),
    check('caseCategory', 'Case category is required.').not().isEmpty(),
	check('caseName', 'Case name is required.').not().isEmpty()
], (req, res) => {
	const newSpecialistExpertise = new SpecialistExpertise({
        specialistID: req.body.specialistID,
        caseCategory: req.body.caseCategory,
		caseName: req.body.caseName
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
		SpecialistExpertise.create(newSpecialistExpertise, (err, specialistExpertise) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					SpecialistExpertiseID: SpecialistExpertise._id,
					message: 'Successfully added Specialist Expertise!'
				})
			}
		})
	}
});

router.put('/:id', [
	check('specialistID', 'Specialist is required.').not().isEmpty(),
    check('caseCategory', 'Case category is required.').not().isEmpty(),
	check('caseName', 'Case name is required.').not().isEmpty()
], (req, res) => {
	var updateSpecialistExpertise = {
        specialistID: req.body.specialistID,
        caseCategory: req.body.caseCategory,
		caseName: req.body.caseName
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
		SpecialistExpertise.findByIdAndUpdate(req.params.id, updateSpecialistExpertise, (err, updatedSpecialistExpertise) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated Specialist Expertise!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteSpecialistExpertise = {
		deleteAt: moment()
	};
	SpecialistExpertise.findByIdAndUpdate(req.params.id, deleteSpecialistExpertise, (err, deletedSpecialistExpertise) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted Specialist Expertise!'
			})
		}
	})
});

module.exports = router;