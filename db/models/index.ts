import { Sequelize, DataTypes } from 'sequelize';

const env = process.env.ENVIRONMENT || 'dev';
import config from '../config';
import Provider from './Provider';
import Token from './Token';
import User from './User';

const dbConfig = config[env];
const sequelize = new Sequelize(dbConfig);

type DBType = {
  sequelize?: typeof sequelize;
  Sequelize?: typeof Sequelize;
};

const db: DBType = {};

const models = [Provider, Token, User];

models.forEach((model) => {
  const instance = model(sequelize, DataTypes);
  db[instance.name] = instance;
});

Object.keys(db).forEach((modelName: string) => {
  console.log(`${db[modelName]} present!`);
  if (db[modelName].associate) {
    console.log(`${db[modelName]} has associate function!`);
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
