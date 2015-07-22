module.exports = function() {
		this.status(500).render('error', {
			message: 'Oops. Something appears to be broken...',
			status: 500
		});
	};