import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { LoginDto, RegisterDto, AuthResponse, TokenResponse } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store refresh token in database
    await this.userService.updateRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // New method for cookie-based login
  async loginWithCookies(
    loginDto: LoginDto
  ): Promise<{ tokens: TokenResponse; user: any }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store refresh token in database
    await this.userService.updateRefreshToken(user.id, refresh_token);

    return {
      tokens: {
        access_token,
        refresh_token,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store refresh token in database
    await this.userService.updateRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  // New method for cookie-based registration
  async registerWithCookies(
    registerDto: RegisterDto
  ): Promise<{ tokens: TokenResponse; user: any }> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store refresh token in database
    await this.userService.updateRefreshToken(user.id, refresh_token);

    return {
      tokens: {
        access_token,
        refresh_token,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async refreshTokens(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Get full user record including refreshToken for verification
      const user = await this.userService.findByEmail(payload.email);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });
      const refresh_token = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      // Update refresh token in database
      await this.userService.updateRefreshToken(user.id, refresh_token);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // New method for cookie-based refresh
  async refreshTokensWithCookies(refreshToken: string): Promise<TokenResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // Get full user record including refreshToken for verification
      const user = await this.userService.findByEmail(payload.email);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });
      const refresh_token = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      // Update refresh token in database
      await this.userService.updateRefreshToken(user.id, refresh_token);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }
}
