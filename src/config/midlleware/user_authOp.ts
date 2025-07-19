import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../types/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

interface JWTPayload {
  userId: number;  // MUDANÇA: usar 'userId' em vez de 'id'
  email: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      logger.warn('Token não fornecido ou formato inválido', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      res.status(401).json({
        success: false,
        message: 'Token de acesso requerido',
      });
      return;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      logger.error('JWT_SECRET não definido');
      res.status(500).json({
        success: false,
        message: 'Erro de configuração do servidor',
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // MUDANÇA: usar 'decoded.userId' em vez de 'decoded.id'
    if (!decoded.userId || !decoded.email) {
      logger.warn('Token inválido - dados do usuário ausentes');
      res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
      return;
    }

    req.user = {
      id: decoded.userId,  // MUDANÇA: mapear 'userId' para 'id'
      email: decoded.email,
    };

    next();
  } catch (err: any) {
    const error = err as { name: string; message: string };

    logger.error('Erro na validação do token:', {
      error: error.message,
      name: error.name,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    const jwtErrorMessages = {
      TokenExpiredError: 'Token expirado',
      JsonWebTokenError: 'Token inválido',
      NotBeforeError: 'Token não ativo ainda',
    };

    const message =
      jwtErrorMessages[error.name as keyof typeof jwtErrorMessages] ||
      'Token inválido';

    res.status(401).json({
      success: false,
      message,
    });
  }
};