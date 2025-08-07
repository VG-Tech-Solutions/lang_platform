import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase'
import logger from '../types/logger'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role?: string
  }
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acesso requerido',
        code: 'MISSING_TOKEN'
      })
    }

    // Verificar token com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      logger.warn('Token inválido ou expirado', { 
        error: error?.message,
        token: token.substring(0, 20) + '...'
      })
      return res.status(401).json({ 
        error: 'Token inválido ou expirado',
        code: 'INVALID_TOKEN'
      })
    }

    req.user = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'user'
    }

    logger.debug('Usuário autenticado com sucesso', { 
      userId: user.id,
      email: user.email 
    })

    next()
  } catch (error) {
    logger.error('Erro na autenticação:', error)
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    })
  }
}

export const requireRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      })
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        code: 'INSUFFICIENT_PERMISSIONS'
      })
    }

    next()
  }
}