var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {

  var Passport = sequelize.define('Passport', {
    protocol: {
      type: DataTypes.STRING,
      validate: { isAlphanumeric: true }
    },
    password: {
      type: DataTypes.VIRTUAL,
      validate: { min: 5, max: 50 },
      set: function(val){
        // hash password
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(val, salt);

        this.setDataValue('password_encrypted', hash);
      }
    },
    password_encrypted: {
      type: DataTypes.STRING
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tokens: {
      type: DataTypes.JSON,
      allowNull: true
    },
    accessToken: {
      type: DataTypes.STRING
    }
  }, 
  {
    classMethods: {
      // INFO: 'associate' is used to build assoications in sequelize when the app is started
      associate: function (models) {
        Passport.belongsTo(models.User);
      }
    },
    instanceMethods: {
      validatePassword: function(value, next) {
        bcrypt.compare(value, this.password_encrypted, next);
      }
    }
  });

  return Passport;
};

