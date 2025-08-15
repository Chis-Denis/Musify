import { UserRole } from './user-role.enum';

export class UserLogin {
  email!: string;
  password!: string;
  constructor(value?: Partial<UserLogin>) {
    if (value) Object.assign(this, value);
  }
}

export class UserRegister {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  country!: string;
  constructor(value?: Partial<UserRegister>) {
    if (value) Object.assign(this, value);
  }
}

export class AuthResponse {
  token!: string;
  user!: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };

  constructor(value?: Partial<AuthResponse>) {
    if (value) Object.assign(this, value);
  }
}

export class ForgotPasswordRequest {
  email!: string;

  constructor(value?: Partial<ForgotPasswordRequest>) {
    if (value) Object.assign(this, value);
  }
}

export class ResetPasswordRequest {
  token!: string;
  newPassword!: string;

  constructor(value?: Partial<ResetPasswordRequest>) {
    if (value) Object.assign(this, value);
  }
}

