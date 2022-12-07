import { Model, Sequelize } from 'sequelize';

type ProviderType = {
  id?: number;
  accessToken: string;
  refreshToken: string;
  expiry: number;
  scope: string;
  logoUrl: string;
  trueLayerId: string;
};

export default (sequelize: Sequelize, DataTypes) => {
  class Provider extends Model<ProviderType> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Provider.belongsTo(models.User);
      Provider.hasMany(models.Asset);
    }
  }

  Provider.init(
    {
      accessToken: DataTypes.STRING(2000),
      refreshToken: DataTypes.STRING,
      expiry: DataTypes.INTEGER,
      scope: DataTypes.STRING,
      logoUrl: DataTypes.STRING,
      trueLayerId: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'provider',
      underscored: true,
    }
  );

  return Provider;
};
