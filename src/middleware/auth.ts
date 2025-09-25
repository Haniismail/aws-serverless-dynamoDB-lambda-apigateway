import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tokenInfo } from '../config/envVar';
import { ApiResponse } from '../core/ApiResponse';
import { AuthenticatedRequest } from '../types/auth-request';

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 401, 'Access token required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, tokenInfo.secret, {
        issuer: tokenInfo.issuer,
        audience: tokenInfo.audience,
      }) as { id: string; email: string };

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      next();
    } catch (jwtError) {
      return ApiResponse.error(res, 401, 'Invalid or expired token');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return ApiResponse.error(res, 500, 'Internal server error');
  }
};
