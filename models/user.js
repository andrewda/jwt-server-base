const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

// Define model
const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

// On Save Hook, encrypt password
userSchema.pre('save', function(next) {
	const user = this;

	bcrypt.genSalt(10, (err, salt) => {
		if (err) { return next(err); }

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) { return next(err); }

			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	const user = this;

	bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
		if (err) { return callback(err); }

		callback(null, isMatch);
	});
};

// Create model class
const ModelClass = mongoose.model('user', userSchema);

// Export model
module.exports = ModelClass;
