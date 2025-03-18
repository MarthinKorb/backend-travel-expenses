import { Request } from 'express';
import { UserPayload } from './user.interface'; // Importando a interface do usuário

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}
