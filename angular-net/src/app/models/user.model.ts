import { UserRole } from './user-role.enum';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string;
  country: string;
  role: UserRole;
  isActive?: boolean;
  isDeleted?: boolean;
  token?: string;
}