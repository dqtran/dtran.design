var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  db = {},
  options = abe.config.env.db.options;



var sequelize = new Sequelize(abe.config.env.db.uri, options);

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
  var model = sequelize['import'](path.join(__dirname, file)); // import each model
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
