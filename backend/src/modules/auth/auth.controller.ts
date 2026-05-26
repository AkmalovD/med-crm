import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuards } from './guards/refresh-token.guard';
import { Request } from 'express';
import { JwtPayload } from './types/jwt-payload.type';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(RefreshTokenGuards)
    @Post('refresh')
    refresh(@Req() req: Request) {
        const user = req.user as JwtPayload & { refreshToken: string };
        return this.authService.refreshTokens(user.sub, user.email, user.role);
    }

    @UseGuards(AccessTokenGuard)
    @Get('me')
    me(@Req() req: Request) {
        return req.user;
    }
}