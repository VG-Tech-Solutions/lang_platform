
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../utils/interface/auth_idioma.interface';
import { langnativeService as LangnativeService } from '../../services/interface/Idioma';

const langnativeServiceInstance = new LangnativeService();

export const requireAuth = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Token de acesso requerido'
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não está definida');
      res.status(500).json({
        success: false,
        data: null,
        message: 'Erro de configuração do servidor'
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      
      const userResult = await langnativeServiceInstance.getUserById(decoded.id);
      
      if (!userResult.success) {
        res.status(401).json({
          success: false,
          data: null,
          message: 'Usuário não encontrado'
        });
        return;
      }

      req.user = userResult.data;
      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Token inválido ou expirado'
      });
      return;
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Erro interno do servidor'
    });
  }
};