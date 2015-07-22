var GitHubApi = require('github');

var github = new GitHubApi({
    // required 
    version: "3.0.0",
    // optional 
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub 
    // pathPrefix: "/api/v3", // for some GHEs; none for GitHub 
    timeout: 5000,
    headers: {
        "user-agent": "Cleancut" // GitHub is happy with a unique user agent 
    }
});

github.init = function(token, next){
	this.authenticate({
    type: "oauth",
    token: token
	});

};


module.exports = github;
