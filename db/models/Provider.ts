import { Model, Sequelize } from 'sequelize';

type ProviderType = {
  id?: number;
  name: string;
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
      Provider.hasMany(models.UserProvider);
    }
  }

  Provider.init(
    {
      name: DataTypes.STRING,
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
