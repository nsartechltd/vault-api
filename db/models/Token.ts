import { Model, Sequelize } from 'sequelize';

type TokenType = {
  id?: number;
  userId: number;
  providerId: number;
  accessToken: string;
  refreshToken: string;
  expiry: number;
  scope: string;
};

export default (sequelize: Sequelize, DataTypes) => {
  class Token extends Model<TokenType> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Token.belongsTo(models.Provider);
      Token.belongsTo(models.User);
    }
  }

  Token.init(
    {
      accessToken: DataTypes.STRING(2000),
      refreshToken: DataTypes.STRING,
      expiry: DataTypes.INTEGER,
      scope: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      providerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'token',
      underscored: true,
    }
  );

  return Token;
};
