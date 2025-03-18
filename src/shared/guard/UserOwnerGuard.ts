import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../auth/authenticated-request.interface';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    const ownerId = request.params.userId;

    if (!user || user.id !== parseInt(ownerId, 10)) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar estes dados',
      );
    }

    return true;
  }
}
