import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import logger from '../types/logger'

// Schemas de validação
const updateUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo').optional(),
  lang_native: z.string().min(2, 'Idioma inválido').max(5, 'Idioma inválido').optional(),
})

const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório')
})

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório')
})

// Middleware genérico de validação
const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
  if (error instanceof z.ZodError) {
    logger.warn('Dados inválidos recebidos', { 
      issues: error.issues,          
      path: req.path,
      method: req.method
    })
        
       return res.status(400).json({
        error: 'Dados inválidos',
        code: 'VALIDATION_ERROR',
        details: error.issues.map(err => ({
         field: err.path.join('.'),
            message: err.message
            }))
            })

      }
      next(error)
    }
  }
}

// Middlewares específicos
export const validateUpdateUser = validate(updateUserSchema)
export const validateVerifyToken = validate(verifyTokenSchema)
export const validateRefreshToken = validate(refreshTokenSchema)

// Middleware para validar parâmetros da URL
export const validateUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[paramName]
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    
    if (!uuidRegex.test(value)) {
      return res.status(400).json({
        error: 'UUID inválido',
        code: 'INVALID_UUID',
        field: paramName
      })
    }
    
    next()
  }
}