const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const config = require('../config');

const cookieExtractor = function(req) {
	var token = null;

	if (req && req.cookies) {
		token = req.cookies[config.cookie];
	}

	return token;
};

// Setup options for Local Strategy
const localOptions = {
	usernameField: 'username'
};

// Create Local Strategy
const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
	User.findOne({ $or: [{ username }, { email: username }] }, (err, user) => {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }

		user.comparePassword(password, (err, isMatch) => {
			if (err) { return done(err); }
			if (!isMatch) { return done(null, false); }

			return done(null, user);
		});
	});
});

// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromExtractors([
		ExtractJwt.fromAuthHeader(),
		cookieExtractor
	]),
	secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	User.findById(payload.sub, (err, user) => {
		if (err) { return done(err, false); }
		if (!user) { return done(null, false); }

		if (user) {
			done(null, user);
		}
	});
});

// Tell passport to use these Strategies
passport.use('jwt', jwtLogin);
passport.use('local', localLogin);
