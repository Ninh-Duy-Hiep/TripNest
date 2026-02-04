import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface UserFromJwt {
  id: string;
  email: string;
  role: string;
  refreshToken?: string;
}

export interface RequestWithUser extends Request {
  user: UserFromJwt;
}
