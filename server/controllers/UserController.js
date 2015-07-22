/* global abe */
var path = require('path');

module.exports = {

	'update': function(req, res, next){

        var _user = req.user;

        var imagePath = _user.username,
            url;

		abe.services.multipart.parse(imagePath, req, res, function(err, req){

            var data,
            profile;

            if(req.fields){
                data = {};
                if(req.fields.name) data.name = req.fields.name[0];
                if(req.fields.motto) data.motto = req.fields.motto[0];
            }


            if(req.files){
                if(req.files.profile) {
                    profile = req.files.profile[0];
                    var baseName = path.basename(profile.path);
                    url = '/uploads/' + imagePath + '/' + baseName;
                    console.log('path: ' + profile.path);
                }
            }
            
            _user.update(data)
                .then(function(user){

                    if(data || url){
                        abe.db.Photo.findOrCreate({where: { id: user.ProfilePhotoId }, defaults: { original: url }})
                        .then(function(photo){
                            var _photo = photo[0];
                            _photo.original = url;
                            _photo.save();
                            _user.setProfilePhoto(_photo.id);
                            return res.view('user/update', user);
                        })
                        .catch(next);
                    }else{
                        return res.view('user/update', user);
                    }

                   
                })
                .catch(next);
        });

    }

};