import { DataTypes, Model, Sequelize } from 'sequelize';

export interface OrderItemAttributes {
  id: number;
  orderId: number;
  perfumeId: number;
  size: '30ml' | '50ml' | '100ml';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemCreationAttributes extends Omit<OrderItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class OrderItemModel extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public orderId!: number;
  public perfumeId!: number;
  public size!: '30ml' | '50ml' | '100ml';
  public quantity!: number;
  public unitPrice!: number;
  public totalPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initOrderItemModel = (sequelize: Sequelize): typeof OrderItemModel => {
  OrderItemModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
      },
      perfumeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'perfumes',
          key: 'id',
        },
      },
      size: {
        type: DataTypes.ENUM('30ml', '50ml', '100ml'),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      totalPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      tableName: 'order_items',
      timestamps: true,
      indexes: [
        {
          fields: ['orderId'],
        },
        {
          fields: ['perfumeId'],
        },
        {
          fields: ['size'],
        },
      ],
    }
  );

  return OrderItemModel;
};
