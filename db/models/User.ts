import { Model, Sequelize } from 'sequelize';

type UserType = {
  id?: number;
  name: string;
  email: string;
  cognitoId: string;
};

export default (sequelize: Sequelize, DataTypes) => {
  class User extends Model<UserType> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Provider);
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      cognitoId: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'user',
      underscored: true,
    }
  );

  return User;
};
