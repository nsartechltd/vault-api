import { Model, Sequelize } from 'sequelize';

type AccountType = {
  id?: number;
  type: string;
  name: string;
  currency: string;
  accountNumber: string;
  sortCode: string;
  iban: string;
};

export default (sequelize: Sequelize, DataTypes) => {
  class Account extends Model<AccountType> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Account.belongsTo(models.Asset, { foreignKey: 'assetId' });
    }
  }

  Account.init(
    {
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      currency: DataTypes.STRING,
      accountNumber: DataTypes.STRING,
      sortCode: DataTypes.STRING,
      iban: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'account',
      underscored: true,
    }
  );

  return Account;
};
