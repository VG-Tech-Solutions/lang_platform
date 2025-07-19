import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../utils/interface/auth_idioma.interface';
import { langnativeService as LangnativeService } from '../../services/interface/Idioma';

const langnativeServiceInstance = new LangnativeService();

export const optionalAuth = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não está definida');
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      const userResult = await langnativeServiceInstance.getUserById(decoded.id);

      if (userResult.success) {
        req.user = userResult.data;
      }
    } catch (jwtError) {
      console.log('Token inválido ou expirado:', jwtError);
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    next();
  }
};
