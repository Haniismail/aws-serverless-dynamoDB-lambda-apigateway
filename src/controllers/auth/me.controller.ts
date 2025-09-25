import { Response } from 'express';
import { UserRepository } from '../../database/repository/UserRepository';
import { ApiResponse } from '../../core/ApiResponse';
import { AuthenticatedRequest } from '../../types/auth-request';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return ApiResponse.error(res, 401, 'User not authenticated');
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findById(userId);

    if (!user) {
      return ApiResponse.error(res, 404, 'User not found');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return ApiResponse.success(res, userWithoutPassword, 'User profile retrieved successfully');
  } catch (error) {
    console.error('Get me error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};