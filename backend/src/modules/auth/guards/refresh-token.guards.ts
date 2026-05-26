import {AuthGuard} from "@nestjs/passport";

export class RefreshTokenGuards extends AuthGuard('jwt') {}