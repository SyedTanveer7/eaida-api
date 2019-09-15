const express = require('express');
const router = express.Router({
	mergeParams: true
});
const FamilyMember = require("../../models/familyMember");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// FAMILY MEMBER ENDPOINTS

router.get("/", (req, res) => {
	// Needs to have userID
	req.query.deleteAt = {$exists: false};
	FamilyMember.find(req.query).populate('patientID').sort({createdAt: -1}).exec((err, allFamilyMember) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: allFamilyMember
			})
		}
	});
});

router.get("/:id", (req, res) => {
	FamilyMember.findById(req.params.id).populate('patientID').exec((err, familyMember) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: familyMember
			})
		}
	});
});

router.post("/", [
	check('firstName', 'First Name is required.').not().isEmpty(),
	check('lastName', 'Last Name is required.').not().isEmpty(),
	check('middleName', 'Middle Name is required.').not().isEmpty(),
	check('gender', 'Gender is required.').not().isEmpty(),
	check('birthDate', 'Birth Date is required.').not().isEmpty(),
    check('relation', 'Your Address is required.').not().isEmpty()
], (req, res) => {
	const newFamilyMember = new FamilyMember({
		patientID: req.body.patientID,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		middleName: req.body.middleName,
		gender: req.body.gender,
		birthDate: req.body.birthDate,
        relation: req.body.relation
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
		FamilyMember.create(newFamilyMember, (err, familyMember) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					familyMemberID: familyMember._id,
					message: 'Successfully added Family Member!'
				})
			}
		})
	}
});

router.put('/:id', [
	check('firstName', 'First Name is required.').not().isEmpty(),
	check('lastName', 'Last Name is required.').not().isEmpty(),
	check('middleName', 'Middle Name is required.').not().isEmpty(),
	check('gender', 'Gender is required.').not().isEmpty(),
	check('birthDate', 'Birth Date is required.').not().isEmpty(),
    check('relation', 'Your Address is required.').not().isEmpty()
], (req, res) => {
	var updateFamilyMember = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		middleName: req.body.middleName,
		gender: req.body.gender,
		birthDate: req.body.birthDate,
        relation: req.body.relation
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
		FamilyMember.findByIdAndUpdate(req.params.id, updateFamilyMember, (err, updateFamilyMember) => {
			if (err) {
				res.json({
					error: true,
					message: err
				})
			} else {
				res.json({
					error: false,
					message: 'Successfully updated Family Member!'
				})
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteFamilyMember = {
		deleteAt: moment()
	};
	FamilyMember.findByIdAndUpdate(req.params.id, deleteFamilyMember, (err, deleteFamilyMember) => {
		if (err) {
			res.json({
				error: true,
				message: err
			})
		} else {
			res.json({
				error: false,
				message: 'Successfully deleted Family Member!'
			})
		}
	})
});

module.exports = router;