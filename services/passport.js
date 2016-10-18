const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const config = require('../config');

// Setup options for Local Strategy
const localOptions = {
	usernameField: 'email'
};

// Create Local Strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
	User.findOne({ email }, (err, user) => {
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
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
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
