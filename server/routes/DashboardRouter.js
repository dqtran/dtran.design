module.exports = function (app, express) {


	 var router = express.Router();
	 var policies = [abe.policies.passport, abe.policies.basicAuth];

    router.all('*', policies);

	router.get('/', abe.controllers.dashboard.index);
	app.use('/dashboard', router);
};