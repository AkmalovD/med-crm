import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {JwtPayload} from "../types/jwt-payload.type";
import { Request } from "express";


// refresh-token.strategy.ts
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'), // ← getOrThrow
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
        return { ...payload, refreshToken };
    }
}