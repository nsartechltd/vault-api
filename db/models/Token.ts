import { Model } from 'sequelize';

export type TokenProvider = {
  id?: number;
  accessToken: string;
  refreshToken: string;
  expiry: number;
  scope: string;
};

export default (sequelize, DataTypes) => {
  class Token extends Model<TokenProvider> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Token.hasMany(models.UserProvider);
    }
  }

  Token.init(
    {
      accessToken: DataTypes.STRING(2000),
      refreshToken: DataTypes.STRING,
      expiry: DataTypes.INTEGER,
      scope: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'token',
      underscored: true,
    }
  );

  return Token;
};
