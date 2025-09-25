export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserCreate {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface IUserUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  verified?: boolean;
}

export interface IUserLogin {
  email: string;
  password: string;
}
