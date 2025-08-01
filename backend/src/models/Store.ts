import { DataTypes, Model, Sequelize } from 'sequelize';

export interface StoreAttributes {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  managerId?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StoreCreationAttributes extends Omit<StoreAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class StoreModel extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public phone?: string;
  public email?: string;
  public managerId?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initStoreModel = (sequelize: Sequelize): typeof StoreModel => {
  StoreModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [2, 100],
        },
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: [10, 20],
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'stores',
      timestamps: true,
      indexes: [
        {
          fields: ['name'],
        },
        {
          fields: ['managerId'],
        },
        {
          fields: ['isActive'],
        },
      ],
    }
  );

  return StoreModel;
};
