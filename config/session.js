module.exports = {
	config: {
		secret: 'dqtran-design',
		resave: true,
		saveUninitialized: false,
	},
	store: {
		options: {
			uri: process.env.REDISTOGO_URL || 'redis://localhost:6379/dtran_design'
		}
	}
};
