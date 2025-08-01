import { DataTypes, Model, Sequelize } from 'sequelize';
import { StoreModel } from './Store';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'store_user';
  storeId?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Association properties
  store?: StoreModel;
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'store_user';
  public storeId?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Association properties
  public store?: StoreModel;
}

export const initUserModel = (sequelize: Sequelize): typeof UserModel => {
  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [6, 255],
        },
      },
      role: {
        type: DataTypes.ENUM('admin', 'store_user'),
        allowNull: false,
        defaultValue: 'store_user',
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'stores',
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
      tableName: 'users',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['username'],
        },
        {
          unique: true,
          fields: ['email'],
        },
        {
          fields: ['role'],
        },
        {
          fields: ['storeId'],
        },
      ],
    }
  );

  return UserModel;
};
