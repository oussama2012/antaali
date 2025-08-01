import { Sequelize } from 'sequelize';
import { UserModel, initUserModel } from './User';
import { StoreModel, initStoreModel } from './Store';
import { WorkerModel, initWorkerModel } from './Worker';
import { PerfumeModel, initPerfumeModel } from './Perfume';
import { OrderModel, initOrderModel } from './Order';
import { OrderItemModel, initOrderItemModel } from './OrderItem';

// Use DATABASE_URL if available (Railway), otherwise use individual variables
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    })
  : new Sequelize({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'antaali_erp',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      dialect: (process.env.DB_DIALECT as any) || 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

// Initialize models
const User = initUserModel(sequelize);
const Store = initStoreModel(sequelize);
const Worker = initWorkerModel(sequelize);
const Perfume = initPerfumeModel(sequelize);
const Order = initOrderModel(sequelize);
const OrderItem = initOrderItemModel(sequelize);

// Define associations
User.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Store.hasMany(User, { foreignKey: 'storeId', as: 'users' });

Worker.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Store.hasMany(Worker, { foreignKey: 'storeId', as: 'workers' });

Order.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Store.hasMany(Order, { foreignKey: 'storeId', as: 'orders' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Perfume, { foreignKey: 'perfumeId', as: 'perfume' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Perfume.hasMany(OrderItem, { foreignKey: 'perfumeId', as: 'orderItems' });

export {
  sequelize,
  User,
  Store,
  Worker,
  Perfume,
  Order,
  OrderItem,
  UserModel,
  StoreModel,
  WorkerModel,
  PerfumeModel,
  OrderModel,
  OrderItemModel,
};
