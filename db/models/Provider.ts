import { Model, Sequelize } from 'sequelize';

type ProviderType = {
  id?: number;
  name: string;
  providerId: string;
  country: string;
  logoUrl: string;
};

export default (sequelize: Sequelize, DataTypes) => {
  class Provider extends Model<ProviderType> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Provider.hasMany(models.Token);
    }
  }

  Provider.init(
    {
      name: DataTypes.STRING,
      providerId: DataTypes.STRING,
      country: DataTypes.STRING,
      logoUrl: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'provider',
      underscored: true,
    }
  );

  return Provider;
};
