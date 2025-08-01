import { DataTypes, Model, Sequelize } from 'sequelize';

export interface OrderAttributes {
  id: number;
  orderNumber: string;
  storeId: number;
  userId: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  orderDate: Date;
  approvedAt?: Date;
  approvedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes extends Omit<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class OrderModel extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public orderNumber!: string;
  public storeId!: number;
  public userId!: number;
  public status!: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  public totalAmount!: number;
  public notes?: string;
  public orderDate!: Date;
  public approvedAt?: Date;
  public approvedBy?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initOrderModel = (sequelize: Sequelize): typeof OrderModel => {
  OrderModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'orders',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['orderNumber'],
        },
        {
          fields: ['storeId'],
        },
        {
          fields: ['userId'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['orderDate'],
        },
        {
          fields: ['approvedBy'],
        },
      ],
    }
  );

  return OrderModel;
};
