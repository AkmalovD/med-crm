import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
    ) {}

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

        const tokens = await this.generateTokens({ sub: user.id, email: user.email, role: user.role });
        return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
    }

    async refreshTokens(userId: string, email: string, role: any) {
        const tokens = await this.generateTokens({ sub: userId, email, role });
        return tokens;
    }

    private async generateTokens(payload: JwtPayload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_ACCESS_SECRET'),
                expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);

        return { accessToken, refreshToken };
    }
}