'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
let config = {};

try {
  config = require(__dirname + '/../config/config.json')[env] || {};
} catch (e) {
  config = {};
}

const db = {};

let sequelize;
if (process.env.DATABASE_URL) {
  const isSslNeeded =
    process.env.DB_SSL === 'true' ||
    process.env.DATABASE_URL.includes('aivencloud.com') ||
    process.env.DATABASE_URL.includes('ssl-mode');

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    dialectOptions: isSslNeeded ? { ssl: { rejectUnauthorized: false } } : {},
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  const database = process.env.DB_NAME || config.database || 'tutorialDB';
  const username = process.env.DB_USER || config.username || 'root';
  const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : config.password;
  const host = process.env.DB_HOST || config.host || '127.0.0.1';
  const port = process.env.DB_PORT || config.port || 3306;
  const dialect = process.env.DB_DIALECT || config.dialect || 'mysql';

  if (dialect === 'sqlite') {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || path.join(__dirname, '../database.sqlite'),
      logging: false,
    });
  } else {
    const isSslNeeded =
      process.env.DB_SSL === 'true' ||
      host.includes('aivencloud.com') ||
      (dialect === 'mysql' && host !== '127.0.0.1' && host !== 'localhost');

    sequelize = new Sequelize(database, username, password, {
      host: host,
      port: port,
      dialect: dialect,
      logging: false,
      dialectOptions: isSslNeeded ? { ssl: { rejectUnauthorized: false } } : {},
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
