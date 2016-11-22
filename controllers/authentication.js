const jwt = require('jwt-simple');

const User = require('../models/user');

const config = require('../config');

function tokenForUser(user) {
	const timestamp = (new Date()).getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
	res.cookie(config.cookie, tokenForUser(req.user), { httpOnly: true });
	res.send({ success: true, token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

	if (!username || !email || !password) {
		return res.status(422).send({ success: false, error: 'Missing parameters' });
	}

	if (!/^[a-zA-Z0-9-_.]*$/.test(username)) {
		return res.status(422).send({ success: false, error: 'Invalid username' });
	}

	if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
		return res.status(422).send({ success: false, error: 'Invalid email' });
	}

	// Check if given username exists
	User.findOne({ $or: [{ username }, { email }] }, (err, existingUser) => {
		if (err) { return next(err); }

		// If exists, return error
		if (existingUser && existingUser.username === username) {
			return res.status(422).send({ success: false, error: 'Username already in use' });
		}

		if (existingUser && existingUser.email === email) {
			return res.status(422).send({ success: false, error: 'Email already in use' })
		}

		// If does not exist, create user and return success
		const user = new User({
			username,
			email,
			password
		});

		user.save((err) => {
			if (err) { return next(err); }

			res.send({ success: true, token: tokenForUser(user) });
		});
	});
};
