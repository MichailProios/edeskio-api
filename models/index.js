const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV;
const config =
  require(`${__dirname}/../utilities/sequelize/sequelize-config.js`)[env];

//Create an empty object which can store our databses
const db = {};

//Extract the database information into an array
const databases = Object.keys(config.databases);

for (let i = 0; i < databases.length; ++i) {
  let database = databases[i];
  let dbPath = config.databases[database];

  //Store the database connection in our db object
  db[database] = new Sequelize(
    dbPath.database,
    dbPath.username,
    dbPath.password,
    dbPath
  );
}

//Add models from edeskio folder
fs.readdirSync(__dirname + "/edeskio")
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname + "/edeskio", file))(
      db.edeskio,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
