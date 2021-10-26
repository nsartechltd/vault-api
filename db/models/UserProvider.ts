import { Model, Sequelize } from 'sequelize';

type UserProviderType = {
  id?: number;
  userId: number;
  providerId: number;
  tokenId: number;
};

export default (sequelize: Sequelize, DataTypes) => {
  class UserProvider extends Model<UserProviderType> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProvider.belongsTo(models.User);
      UserProvider.belongsTo(models.Token);
      UserProvider.belongsTo(models.Provider);
    }
  }

  UserProvider.init(
    {
      userId: DataTypes.INTEGER,
      providerId: DataTypes.INTEGER,
      tokenId: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'user_provider',
      underscored: true,
    }
  );

  return UserProvider;
};
