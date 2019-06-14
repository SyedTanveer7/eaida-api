const express = require('express');
const router = express.Router({
	mergeParams: true
});
const Address = require("../../models/address");
const {
	check,
	validationResult
} = require('express-validator/check');
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');

// ADDRESS ENDPOINTS

router.get("/", (req, res) => {
	// Needs to have userID
	req.query.deleteAt = {$exists: false};
	Address.find(req.query).sort( { _id: -1 } ).exec((err, allAddress) => {
		if (err) {
			res.json({
                error: true,
				message: err
			})
		} else {
			res.json({
                error: false,
				message: allAddress
				// authData: req.authData
			})

			console.log(allAddress);
		}
	});
	
});

router.get("/:id", (req, res) => {
	Address.findById(req.params.id).exec((err, address) => {
		if (err) {
			res.json({
                error: true,
				message: err
			})
		} else {
			res.json({
                error: false,
				message: address
			})
		}
	});
});

router.post("/", [
	check('title', 'Title is required.').not().isEmpty(),
	check('coordinates', 'Coordinates is required.').not().isEmpty(),
	check('addressLine1', 'Address Line 1 is required.').not().isEmpty(),
	check('cityTown', 'City/Town is required.').not().isEmpty(),
	check('stateProvinceRegion', 'State/Province/Region is required.').not().isEmpty(),
	check('zipPostalCode', 'Zip/Postal Code is required.').not().isEmpty(),
	check('country', 'Code is required.').not().isEmpty()
], (req, res) => {
	const newAddress = new Address({
		userID: req.body.userID,
		title: req.body.title,
		coordinates: req.body.coordinates,
		addressLine1: req.body.addressLine1,
		addressLine2: req.body.addressLine2,
		cityTown: req.body.cityTown,
		stateProvinceRegion: req.body.stateProvinceRegion,
		zipPostalCode: req.body.zipPostalCode,
		country: req.body.country
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
		Address.create(newAddress, (err, address) => {
			if (err) {
				res.json({
                    error: true,
                    message: err
                })
			} else {
				res.json({
                    error: false,
                    message: 'Successfully added new Address!'
                })
			}
		})
	}
});

router.put('/:id', [
	check('title', 'Title is required.').not().isEmpty(),
	check('coordinates', 'Coordinates is required.').not().isEmpty(),
	check('addressLine1', 'Address Line 1 is required.').not().isEmpty(),
	check('cityTown', 'City/Town is required.').not().isEmpty(),
	check('stateProvinceRegion', 'State/Province/Region is required.').not().isEmpty(),
	check('zipPostalCode', 'Zip/Postal Code is required.').not().isEmpty(),
	check('country', 'Code is required.').not().isEmpty()
], (req, res) => {
	var updateAddress = {
		title: req.body.title,
		coordinates: req.body.coordinates,
		addressLine1: req.body.addressLine1,
		addressLine2: req.body.addressLine2,
		cityTown: req.body.cityTown,
		stateProvinceRegion: req.body.stateProvinceRegion,
		zipPostalCode: req.body.zipPostalCode,
		country: req.body.country
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
		Address.findByIdAndUpdate(req.params.id, updateAddress, (err, updateAddress) => {
			if (err) {
				res.json({
                    error: true,
                    message: err
                })
			} else {
				res.json({
                    error: false,
                    message: 'Successfully updated address!'
                })
			}
		})
	}
});

router.delete('/:id', (req, res) => {
	var deleteAddress = {
		deleteAt: moment()
	};
	Address.findByIdAndUpdate(req.params.id, deleteAddress, (err, deleteAddress) => {
		if (err) {
            res.json({
                error: true,
                message: err
            })
        } else {
            res.json({
                error: false,
                message: 'Successfully deleted address!'
            })
        }
	})
});

module.exports = router;