const jwt = require("jsonwebtoken");

// all middleware goes here
var middlewareObj = {};

middlewareObj.setToken = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}

middlewareObj.verifyToken = (req, res, next) => {
	jwt.verify(req.token, 'secretKey', (err, authData) => {
		if(err) {
			res.sendStatus(403)
		} else {
			req.authData = authData;
			next();
		}
	});
}

module.exports = middlewareObj;