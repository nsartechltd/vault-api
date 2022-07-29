import { Model, Sequelize } from 'sequelize';

type TransactionType = {
  id?: number;
  transactionId: string;
  normalisedProviderTransactionId: string;
  providerTransactionId: string;
  timestamp: string;
  description: string;
  amount: number;
  currency: string;
  type: string;
  category: string;
  classification: string;
  merchant: string;
  balanceAmount: number;
  balanceCurrency: string;
  meta: string;
};

export default (sequelize: Sequelize, DataTypes) => {
  class Transaction extends Model<TransactionType> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Asset, { foreignKey: 'assetId' });
    }
  }

  Transaction.init(
    {
      transactionId: DataTypes.STRING,
      normalisedProviderTransactionId: DataTypes.STRING,
      providerTransactionId: DataTypes.STRING,
      timestamp: DataTypes.DATE,
      description: DataTypes.STRING,
      amount: DataTypes.NUMBER,
      currency: DataTypes.STRING,
      type: DataTypes.STRING,
      category: DataTypes.STRING,
      classification: DataTypes.STRING,
      merchant: DataTypes.STRING,
      balanceAmount: DataTypes.NUMBER,
      balanceCurrency: DataTypes.STRING,
      meta: DataTypes.JSON,
    },
    {
      sequelize,
      tableName: 'transaction',
      underscored: true,
    }
  );

  return Transaction;
};
