module.exports = function (sequelize, DataTypes) {

  // var Photo = sequelize.define('Photo', {

  //   original: {
  //     type: DataTypes.STRING,
  //     get: function(){

  //       var url = abe.config.env.s3.url + abe.config.env.s3.bucket;
  //       return  url + this.getDataValue('original');
  //     }
  //   }

  var Photo = sequelize.define('Photo', {

    url: {
      type: DataTypes.VIRTUAL,
      get: function(){

        var url = abe.config.env.s3.url;
        return  url + this.getDataValue('path');
      }
    },

    path: { 
      type: DataTypes.STRING
    },

  },
  {
    timestamps: false,
    classMethods: {
      // INFO: 'associate' is used to build assoications in sequelize when the app is started
      associate: function (models) {

      }
    },
    instanceMethods: {
      
    }
  });

  return Photo;
};
