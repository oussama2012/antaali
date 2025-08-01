import { DataTypes, Model, Sequelize } from 'sequelize';

export interface WorkerAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position: string;
  salary?: number;
  storeId: number;
  hireDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkerCreationAttributes extends Omit<WorkerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class WorkerModel extends Model<WorkerAttributes, WorkerCreationAttributes> implements WorkerAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email?: string;
  public phone?: string;
  public position!: string;
  public salary?: number;
  public storeId!: number;
  public hireDate!: Date;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initWorkerModel = (sequelize: Sequelize): typeof WorkerModel => {
  WorkerModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2, 50],
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: [10, 20],
        },
      },
      position: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [2, 100],
        },
      },
      salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
      },
      hireDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'workers',
      timestamps: true,
      indexes: [
        {
          fields: ['storeId'],
        },
        {
          fields: ['position'],
        },
        {
          fields: ['isActive'],
        },
        {
          fields: ['firstName', 'lastName'],
        },
      ],
    }
  );

  return WorkerModel;
};
