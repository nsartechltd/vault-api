import { Model, Sequelize } from 'sequelize';

type AssetType = {
  id?: number;
  type: string;
  accountId: string;
};

export default (sequelize: Sequelize, DataTypes) => {
  class Asset extends Model<AssetType> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Asset.belongsTo(models.Provider);
      Asset.hasMany(models.Transaction);
      Asset.hasOne(models.Account);
    }
  }

  Asset.init(
    {
      type: DataTypes.ENUM('account', 'card'),
      accountId: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'asset',
      underscored: true,
    }
  );

  return Asset;
};
