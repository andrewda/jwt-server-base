const randomstring = require('randomstring');

module.exports = {
	database: 'mongodb://localhost:auth/auth',
	secret: randomstring.generate() // regenerated everytime the app starts up
};
