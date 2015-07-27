var basicAuth = require('basic-auth-connect');

module.exports = function (app, express) {

	app.get('/', abe.controllers.home.index);

	app.get('/seekr', abe.controllers.home.seekr);

	app.get('/cleancut', abe.controllers.home.cleancut);

	app.get('/soccerfriends', abe.controllers.home.soccerfriends);

	app.get('/skratchlabs', abe.controllers.home.skratchlabs);
};
