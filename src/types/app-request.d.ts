import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

declare interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

declare interface TokenPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
