const express = require('express');
const router = express.Router({
	mergeParams: true
});
const moment = require('moment');
const jwt = require("jsonwebtoken");
const middleware = require('../../middleware');
const braintree = require('braintree');

// CONNECT BRAINTREE

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "6kmm6mzcmpvx3r8d",
    publicKey: "h4pkjmmqhvby2dv9",
    privateKey: "aa608033b6b23a05ebb7155b727925b6"
});

// BRAINTREE ENDPOINTS

router.get("/client_token", (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.send(response.clientToken);
  });
});

router.post("/checkout", (req, res) => {
  var amountFromTheClient = req.body.amount;
  var nonceFromTheClient = req.body.nonce;
  // Use payment method nonce here
  gateway.transaction.sale({
    amount: amountFromTheClient,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, (err, result) => {
    if (err) {
        console.error(err);
        return;
    }

    if (result.success) {
        res.send(result);
    } else {
        console.error(result.message);
    }
  });
});

module.exports = router;