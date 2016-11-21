const passport = require('passport');

const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
	app.get('/', (req, res) => {
		res.send({ message: 'This content does not require authentication'});
	});

	app.get('/secure', requireAuth, (req, res) => {
		res.send({ message: 'This content requires authentication'});
	});

	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signup);
}
