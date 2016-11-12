const randomstring = require('randomstring');

module.exports = {
	database: 'mongodb://localhost:auth/auth',
	cookie: 'user_session',
	secret: randomstring.generate() // regenerated everytime the app starts up
};
