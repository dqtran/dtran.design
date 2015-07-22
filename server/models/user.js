var Instance = require('sequelize/lib/instance');
var Promise = require('bluebird');

module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define('User', {

    username: {
      type: DataTypes.STRING,
      unique: { args: true, message: "Username must be unique." },
      validate: { 
        min: 3, 
        max: 45,
        is: /^[A-Za-z][A-Za-z0-9-]+$/i // must start with letter and only have letters, numbers, dashes
      },
    },

    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true, max: 90 },
      unique: true,
    },
  }, 
  {
    classMethods: {
      // INFO: 'associate' is used to build assoications in sequelize when the app is started
      associate: function (models) {
        
        User.belongsTo(models.Photo, { as: 'Photo', onDelete: 'cascade', hooks: true }); // Adds ProfilePhotoId to User
        User.hasMany(models.Passport, { onDelete: 'cascade', hooks: true }); // Adds UserId to Passport
      }
    },

    instanceMethods: {

      toJSON: function() {
        var res = Instance.prototype.toJSON.call(this);

        delete res.roles;
        return res;

      },

      // addImages: function(ProfilePhoto, next){
        
      //       Promise.props({
      //           ProfilePhoto: abe.db.Photo.create,
      //       })
      //       .then(function(images){
                
      //           if(!images) return next(null, false);

      //           DesktopPhotoId = images.desktop.id;

      //           header.save().then(function(saved){

      //               if(!saved) return next(err, false);
      //               next(null, saved);

      //           })
      //           .catch(function(err){
      //               next(err);
      //           });

      //       })
      //       .catch(function(err){
      //           next(err);
      //       });

      //   },

      //   updateImages: function(ProfilePhoto, next){


      //       Promise.props({
      //           ProfilePhoto: abe.db.Photo.findOne({ where: { id: DesktopPhotoId } }),
      //       })
      //       .then(function(results){

      //           var props = {},
      //           previousProfilePhoto;

      //           if(ProfilePhoto){
      //               // if there is a new url let's prep to delete the old image
      //               if(ProfilePhoto.path){
      //                   previousProfilePhoto = results.ProfilePhoto.path;
      //               }

      //               props.ProfilePhoto = results.ProfileLogo.update(ProfilePhoto, {});
      //           }

      //           Promise.props(props)
      //           .then(function(updated){
      //               if(!updated) return next(null, false);

      //               if(previousProfilePhoto) abe.services.s3.delete(previousProfilePhoto, function(){});

      //               next(null, updated);

      //           })
      //           .catch(function(err){
      //               next(err);
      //           });

      //       })
      //       .catch(function(err){
      //           next(err);
      //       });
      //   }
    }
  });

  return User;
};

