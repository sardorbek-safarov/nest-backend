import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  CookieAuthResponse,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Helper method to set cookies
  private setCookies(
    res: Response,
    access_token: string,
    refresh_token: string
  ) {
    // Set access token cookie (15 minutes)
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    // Set refresh token cookie (7 days)
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
  }

  // Helper method to clear cookies
  private clearCookies(res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<CookieAuthResponse> {
    const { tokens, user } = await this.authService.registerWithCookies(
      registerDto
    );

    // Set cookies
    this.setCookies(res, tokens.access_token, tokens.refresh_token);

    return {
      user,
      message: 'Registration successful',
    };
  }

  // Keep the old endpoint for backward compatibility

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<CookieAuthResponse> {
    const { tokens, user } = await this.authService.loginWithCookies(loginDto);

    // Set cookies
    this.setCookies(res, tokens.access_token, tokens.refresh_token);

    return {
      user,
      message: 'Login successful',
    };
  }
  @Post('refresh')
  async refresh(
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    // Get refresh token from cookie
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshTokensWithCookies(
      refreshToken
    );

    // Set new cookies
    this.setCookies(res, tokens.access_token, tokens.refresh_token);

    return {
      message: 'Tokens refreshed successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.userId);

    // Clear cookies
    this.clearCookies(res);

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
