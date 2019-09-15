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
const stripe = require('stripe')('sk_test_O8lkPr2rE4Oy6V3Inbex9VwI');

// SPECIALIST WEEKLY SCHEDULE ENDPOINTS

router.post("/", [
  check('fee', 'Fee is required.').not().isEmpty(),
	check('cardName', 'Card Name is required.').not().isEmpty(),
  check('cardNumber', 'Card Number is required.').not().isEmpty(),
	check('expMonth', 'Month Expiry is required.').not().isEmpty(),
  check('expYear', 'Year Expiry is required.').not().isEmpty(),
  check('cvc', 'CVC is required.').not().isEmpty()
], (req, res) => {
    stripe.tokens.create({
        card: {
          number: req.body.cardNumber,
          exp_month: req.body.expMonth,
          exp_year: req.body.expYear,
          cvc: req.body.cvc
        }
      }, function(err, token) {
        // asynchronously called
        (async () => {
            const charge = await stripe.charges.create({
                amount: req.body.fee,
                currency: 'usd',
                description: 'Example charge',
                source: token.id,
            });

            var error = false;
            if(charge.status != "succeeded") {
              error = true
            }

            res.json({
              error: error,
              message: charge.id
            })
        })();
      });
});

module.exports = router;