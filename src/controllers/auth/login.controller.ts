import { Request, Response } from 'express';
import { UserRepository } from '../../database/repository/UserRepository';
import { ApiResponse } from '../../core/ApiResponse';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { tokenInfo } from '../../config/envVar';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return ApiResponse.error(res, 400, error.details[0].message);
    }

    const userRepository = new UserRepository();
    
    // Find user by email
    const user = await userRepository.findByEmail(value.email.toLowerCase());
    if (!user) {
      return ApiResponse.error(res, 401, 'Invalid credentials');
    }

    // Check password
    const isPasswordValid = await userRepository.comparePassword(user, value.password);
    if (!isPasswordValid) {
      return ApiResponse.error(res, 401, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      tokenInfo.secret
    );

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return ApiResponse.success(res, {
      user: userWithoutPassword,
      token,
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};