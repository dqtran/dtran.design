
module.exports = function() {
	this.status(404).render('error', {
		message: 'Uh oh. Looks like something\'s missing here...',
		status: 404
	});
};