import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PerfumeAttributes {
  id: number;
  name: string;
  brand?: string;
  description?: string;
  size30ml: number;
  size50ml: number;
  size100ml: number;
  price30ml: number;
  price50ml: number;
  price100ml: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PerfumeCreationAttributes extends Omit<PerfumeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class PerfumeModel extends Model<PerfumeAttributes, PerfumeCreationAttributes> implements PerfumeAttributes {
  public id!: number;
  public name!: string;
  public brand?: string;
  public description?: string;
  public size30ml!: number;
  public size50ml!: number;
  public size100ml!: number;
  public price30ml!: number;
  public price50ml!: number;
  public price100ml!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initPerfumeModel = (sequelize: Sequelize): typeof PerfumeModel => {
  PerfumeModel.init(
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
      brand: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [2, 100],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      size30ml: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      size50ml: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      size100ml: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      price30ml: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      price50ml: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      price100ml: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
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
      tableName: 'perfumes',
      timestamps: true,
      indexes: [
        {
          fields: ['name'],
        },
        {
          fields: ['brand'],
        },
        {
          fields: ['isActive'],
        },
        {
          unique: true,
          fields: ['name', 'brand'],
        },
      ],
    }
  );

  return PerfumeModel;
};
