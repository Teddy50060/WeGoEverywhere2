import { IS_PUBLIC_KEY } from '@backend/src/shared/decorators/public.decorator';
import { ExecutionContext, Injectable , CanActivate  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { IS_OPTIONAL_KEY } from '../decorator/optional-auth.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true; // ❗ ข้าม guard ได้
        }
        
        const isOptional = this.reflector.getAllAndOverride<boolean>(   
            IS_OPTIONAL_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (isOptional) {
            try {
                // พยายามรันการตรวจสอบ JWT ตามปกติ
                // ถ้าสำเร็จ -> req.user จะมีข้อมูล
                
                await super.canActivate(context);
            } catch (error) {
                return true;
            }
            // สำหรับ Optional จะ return true เสมอ
            return true;
        }
        return super.canActivate(context) as Promise<boolean>;
    }
}