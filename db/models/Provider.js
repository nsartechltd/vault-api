import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Provider extends Model {
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
