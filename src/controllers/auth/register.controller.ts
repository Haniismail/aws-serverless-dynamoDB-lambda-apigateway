import { Request, Response } from 'express';
import { UserRepository } from '../../database/repository/UserRepository';
import { ApiResponse } from '../../core/ApiResponse';
import { IUserCreate } from '../../database/model/User';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { tokenInfo } from '../../config/envVar';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required().min(1).max(50),
  lastName: Joi.string().required().min(1).max(50),
  password: Joi.string().required().min(6).max(100),
});

export const register = async (req: Request, res: Response) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return ApiResponse.error(res, 400, error.details[0].message);
    }

    const userRepository = new UserRepository();
    
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(value.email);
    if (existingUser) {
      return ApiResponse.error(res, 409, 'User already exists with this email');
    }

    const userData: IUserCreate = {
      ...value,
      email: value.email.toLowerCase(),
    };

    const user = await userRepository.create(userData);

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
    }, 'User registered successfully', 201);
  } catch (error) {
    console.error('Register error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};
