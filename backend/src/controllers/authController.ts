import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User, Store } from '../models';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

interface JWTPayload {
  userId: number;
  username: string;
  role: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, storeId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Validate store if provided
    if (storeId) {
      const store = await Store.findByPk(storeId);
      if (!store) {
        return res.status(400).json({ error: 'Invalid store ID' });
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      storeId,
      isActive: true,
    });

    // Generate JWT token
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const token = (jwt.sign as any)(
      payload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`User registered: ${username}`);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
      },
      token,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({
      where: { username },
      include: [{ model: Store, as: 'store', attributes: ['id', 'name'] }]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const token = (jwt.sign as any)(
      payload,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`User logged in: ${username}`);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
        store: user.store,
      },
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'username', 'email', 'role', 'storeId', 'createdAt'],
      include: [{ model: Store, as: 'store', attributes: ['id', 'name', 'address'] }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email } = req.body;
    const userId = req.user!.id;

    // Check if username/email already exists for other users
    if (username || email) {
      const whereConditions: any[] = [];
      if (username) whereConditions.push({ username });
      if (email) whereConditions.push({ email });
      
      const existingUser = await User.findOne({
        where: {
          [Op.and]: [
            { [Op.or]: whereConditions },
            { id: { [Op.ne]: userId } }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
    }

    // Update user
    await User.update(
      { username, email },
      { where: { id: userId } }
    );

    const updatedUser = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role', 'storeId'],
      include: [{ model: Store, as: 'store', attributes: ['id', 'name'] }]
    });

    logger.info(`Profile updated for user: ${userId}`);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
