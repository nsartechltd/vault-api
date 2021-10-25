import { Sequelize, DataTypes } from 'sequelize';

const env = process.env.ENVIRONMENT || 'dev';
import config from '../config';
import Provider from './Provider';
import Token from './Token';
import User from './User';
import UserProvider from './UserProvider';

const dbConfig = config[env];

const db = {};
const sequelize = new Sequelize(dbConfig);

const models = [Provider, Token, User, UserProvider];

models.forEach((model) => {
  const instance = model(sequelize, DataTypes);
  db[instance.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
