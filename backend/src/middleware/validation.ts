import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      logger.warn('Validation error:', errorMessage);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errorMessage 
      });
    }
    
    next();
  };
};

// User validation schemas
export const userRegistrationSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'store_user').default('store_user'),
  storeId: Joi.number().integer().positive().optional(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'store_user').default('store_user'),
  storeId: Joi.number().integer().positive().optional(),
});

export const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('admin', 'store_user').optional(),
  storeId: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
});

// Store validation schemas
export const storeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  address: Joi.string().required(),
  phone: Joi.string().min(10).max(20).optional(),
  email: Joi.string().email().optional(),
  managerId: Joi.number().integer().positive().optional(),
});

// Worker validation schemas
export const workerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(10).max(20).optional(),
  position: Joi.string().min(2).max(100).required(),
  salary: Joi.number().positive().optional(),
  storeId: Joi.number().integer().positive().required(),
  hireDate: Joi.date().optional(),
});

// Perfume validation schemas
export const perfumeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  brand: Joi.string().min(2).max(100).optional(),
  description: Joi.string().optional(),
  size30ml: Joi.number().integer().min(0).default(0),
  size50ml: Joi.number().integer().min(0).default(0),
  size100ml: Joi.number().integer().min(0).default(0),
  price30ml: Joi.number().positive().default(0),
  price50ml: Joi.number().positive().default(0),
  price100ml: Joi.number().positive().default(0),
});

// Order validation schemas
export const orderSchema = Joi.object({
  storeId: Joi.number().integer().positive().required(),
  notes: Joi.string().optional(),
  items: Joi.array().items(
    Joi.object({
      perfumeId: Joi.number().integer().positive().required(),
      size: Joi.string().valid('30ml', '50ml', '100ml').required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
});

export const orderUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected', 'completed', 'cancelled').required(),
  notes: Joi.string().optional(),
});
