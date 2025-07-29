export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  age?: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// New interface for cookie-based auth response (without tokens in body)
export interface CookieAuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
  message: string;
}

// Interface for internal token handling
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenDto {
  refresh_token: string;
}
