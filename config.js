const crypto = require('crypto');

module.exports = {
	database: 'mongodb://localhost:auth/auth',
	cookie: 'user_session',
	secret: crypto.randomBytes(256) // regenerated everytime the app starts up
};
