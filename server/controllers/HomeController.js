var Promise = require('bluebird');

module.exports = {

    'index': function(req, res, next){
        res.view('index', {
          title: 'dtran.design'
        });
    },
    'seekr': function(req, res, next){
        res.view('seekr', {
          title: 'Seekr'
        });
    },
    'cleancut': function(req, res, next){
        res.view('cleancut', {
          title: 'Cleancut'
        });
    },
    'soccerfriends': function(req, res, next){
        res.view('soccerfriends', {
          title: 'Soccer Friends'
        });
    },
};

function getPassortProviders(){

   var strategies = abe.config.passport,
            providers  = [];

      // Get a list of available providers for use in your templates.
      Object.keys(strategies).forEach(function (key) {
        if (key === 'local' || key === 'bearer') {
          return;
        }

        providers.push({
          name: strategies[key].name,
          slug: key
        }); 

      });

      return providers;
}
