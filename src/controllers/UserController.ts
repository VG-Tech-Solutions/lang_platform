


import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { UserService } from '../services/interface/user'
import logger from '../types/logger'
import prisma from '../config/database' 
import { validationResult } from 'express-validator'
interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    email: string
  }
}
export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  
  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { redirectTo } = req.body
      const finalRedirectTo = redirectTo || `${process.env.FRONTEND_URL}/auth/callback`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: finalRedirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        logger.error('Erro ao iniciar login com Google:', error)
        return res.status(400).json({ 
          error: error.message,
          code: 'GOOGLE_LOGIN_ERROR'
        })
      }

      logger.info('Login com Google iniciado com sucesso')
      
      res.json({ 
        url: data.url,
        provider: 'google'
      })
    } catch (error) {
      logger.error('Erro interno no login com Google:', error)
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      })
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    const userData = req.body

    
    if (!userData.email) {
      return res.status(400).json({ 
        error: 'Email é obrigatório' 
      })
    }

    try {
      const user = await this.userService.createUser(userData)
      
      if (user === null) {
        // Usuário já existe (erro P2002 tratado no serviço)
        return res.status(409).json({ 
          error: 'Usuário já existe' 
        })
      }

      return res.status(201).json(user)
    } catch (error: any) {
      console.error('Erro no controller:', error)
      
      return res.status(500).json({ 
        error: 'Erro interno ao criar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }


  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      // Extrair ID do usuário do token JWT
      const userId = req.user?.id
      
      if (!userId) {
        logger.warn('Tentativa de acesso sem token válido')
        return res.status(401).json({
          success: false,
          message: 'Token inválido ou ausente'
        })
      }

      // Buscar usuário com informações do idioma nativo
      const userWithLanguage = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          lang_native: true,
          is_premium: true,
          subscription_status: true,
          subscription_renewal: true
        }
      })

      if (!userWithLanguage) {
        logger.warn('Usuário não encontrado', { userId })
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        })
      }

      // Buscar informações detalhadas do idioma nativo
      const languageDetails = await prisma.langnative.findUnique({
        where: { lang_code: userWithLanguage.lang_native }
      })

      // Montar resposta com dados do usuário
      const userProfile = {
        id: userWithLanguage.id,
        name: userWithLanguage.name,
        email: userWithLanguage.email,
        isPremium: userWithLanguage.is_premium,
        nativeLanguage: languageDetails ? {
          code: languageDetails.lang_code,
          name: languageDetails.lang_name,
          nativeTitle: languageDetails.native_title,
          flag: languageDetails.lang_flag,
          order: languageDetails.native_order
        } : {
          code: userWithLanguage.lang_native,
          name: userWithLanguage.lang_native,
          nativeTitle: userWithLanguage.lang_native,
          flag: '',
          order: 0
        },
        subscription: {
          status: userWithLanguage.subscription_status,
          renewal: userWithLanguage.subscription_renewal
        }
      }

      logger.info('Perfil do usuário retornado com sucesso', { 
        userId: userWithLanguage.id,
        email: userWithLanguage.email 
      })

      return res.status(200).json({
        success: true,
        data: userProfile
      })

    } catch (error: any) {
      logger.error('Erro ao buscar perfil do usuário:', {
        error: error.message,
        userId: req.user?.id
      })

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

async updateUser(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;
    const { name, lang_native } = req.body;
    if (!userId) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado' 
      });
    }
    if (!name && !lang_native) {
      return res.status(400).json({ 
        error: 'Pelo menos um campo (name ou lang_native) deve ser fornecido' 
      });
    }
    try {
      const updatedUser = await this.userService.updateUser(userId, { name, lang_native });

      if (!updatedUser) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado' 
        });
      }

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ 
        error: 'Erro interno ao atualizar usuário',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

async updateEmail(req: AuthenticatedRequest, res: Response) {
    const { email } = req.body;
    const userId = req.user?.id;

    if (!email) {
      return res.status(400).json({ 
        error: 'Email é obrigatório' 
      });
    }
    if (!userId) {
   return res.status(401).json({ error: 'Usuário não autenticado' });
  }
    try {
      const updatedUser = await this.userService.updateEmail(userId,email);

      if (!updatedUser) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado' 
        });
      }

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error('Erro ao atualizar email:', error);
      return res.status(500).json({ 
        error: 'Erro interno ao atualizar email',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  async getSecurityQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Validar entrada
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: errors.array(),
          code: 'VALIDATION_ERROR'
        })
        return
      }

      const { email } = req.body

      logger.info('Solicitação de pergunta de segurança', { 
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })

      // Buscar pergunta de segurança
      const securityData = await this.userService.getSecurityQuestionByEmail(email)

      if (!securityData) {
        logger.warn('Tentativa de recuperação com email não cadastrado ou sem pergunta', { 
          email,
          ip: req.ip 
        })

        // Não revelar se o usuário existe ou não por segurança
        res.status(404).json({
          success: false,
          error: 'Não foi possível encontrar uma pergunta de segurança para este email. Verifique se você possui uma conta cadastrada e se configurou sua pergunta de segurança.',
          code: 'SECURITY_QUESTION_NOT_FOUND'
        })
        return
      }

      logger.info('Pergunta de segurança enviada com sucesso', { 
        email: securityData.email,
        ip: req.ip
      })

      res.json({
        success: true,
        message: 'Pergunta de segurança encontrada',
        data: {
          email: securityData.email,
          security_question: securityData.security_question
        }
      })

    } catch (error: any) {
      logger.error('Erro ao buscar pergunta de segurança:', {
        error: error.message,
        stack: error.stack,
        email: req.body?.email,
        ip: req.ip
      })

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor. Tente novamente mais tarde.',
        code: 'INTERNAL_ERROR'
      })
    }
  }

  



async resetPassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Validar entrada
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: errors.array(),
          code: 'VALIDATION_ERROR'
        })
        return
      }

      const { email, security_answer, new_password } = req.body

      logger.info('Tentativa de redefinição de senha', { 
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      })

      // Tentar redefinir senha
      const result = await this.userService.resetPasswordWithSecurity({
        email,
        security_answer,
        new_password
      })

      if (!result.success) {
        logger.warn('Falha na redefinição de senha', { 
          email,
          reason: result.message,
          ip: req.ip
        })

        // Determinar status code baseado no tipo de erro
        let statusCode = 500
        let errorCode = 'PASSWORD_RESET_FAILED'

        if (result.message.includes('não encontrado')) {
          statusCode = 404
          errorCode = 'USER_NOT_FOUND'
        } else if (result.message.includes('incorreta')) {
          statusCode = 401
          errorCode = 'INCORRECT_SECURITY_ANSWER'
        } else if (result.message.includes('configurada')) {
          statusCode = 400
          errorCode = 'SECURITY_QUESTION_NOT_CONFIGURED'
        }

        res.status(statusCode).json({
          success: false,
          error: result.message,
          code: errorCode
        })
        return
      }

      logger.info('Senha redefinida com sucesso', { 
        email,
        ip: req.ip
      })

      res.json({
        success: true,
        message: result.message,
        data: {
          reset_completed: true,
          timestamp: new Date().toISOString()
        }
      })

    } catch (error: any) {
      logger.error('Erro ao redefinir senha:', {
        error: error.message,
        stack: error.stack,
        email: req.body?.email,
        ip: req.ip
      })

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor. Tente novamente mais tarde.',
        code: 'INTERNAL_ERROR'
      })
    }
  }


async setSecurityQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Validar entrada
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: errors.array(),
          code: 'VALIDATION_ERROR'
        })
        return
      }

      // Verificar se usuário está autenticado
      // Assumindo que há um middleware que define req.user
      const userId = (req as any).user?.id
      
      if (!userId) {
        logger.warn('Tentativa de configurar pergunta sem autenticação', { 
          ip: req.ip 
        })

        res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
          code: 'UNAUTHORIZED'
        })
        return
      }

      const { security_question, security_answer } = req.body

      logger.info('Configuração de pergunta de segurança', { 
        userId,
        ip: req.ip
      })

      // Configurar pergunta de segurança
      const result = await this.userService.setSecurityQuestion(userId, {
        security_question,
        security_answer
      })

      if (!result.success) {
        logger.warn('Falha ao configurar pergunta de segurança', { 
          userId,
          reason: result.message,
          ip: req.ip
        })

        const statusCode = result.message.includes('não encontrado') ? 404 : 500
        const errorCode = result.message.includes('não encontrado') ? 'USER_NOT_FOUND' : 'SECURITY_QUESTION_SETUP_FAILED'

        res.status(statusCode).json({
          success: false,
          error: result.message,
          code: errorCode
        })
        return
      }

      logger.info('Pergunta de segurança configurada com sucesso', { 
        userId,
        ip: req.ip
      })

      res.json({
        success: true,
        message: result.message,
        data: {
          setup_completed: true,
          timestamp: new Date().toISOString()
        }
      })

    } catch (error: any) {
      logger.error('Erro ao configurar pergunta de segurança:', {
        error: error.message,
        stack: error.stack,
        userId: (req as any).user?.id,
        ip: req.ip
      })

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor. Tente novamente mais tarde.',
        code: 'INTERNAL_ERROR'
      })
    }
  }







  async hasSecurityQuestion(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId)
      
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          error: 'ID de usuário inválido',
          code: 'INVALID_USER_ID'
        })
        return
      }

      // Verificar se usuário logado pode acessar estes dados
      const requestingUserId = (req as any).user?.id
      const userRole = (req as any).user?.role

      if (requestingUserId !== userId && userRole !== 'admin') {
        logger.warn('Tentativa de acesso não autorizado a dados de segurança', { 
          requestingUserId,
          targetUserId: userId,
          ip: req.ip
        })

        res.status(403).json({
          success: false,
          error: 'Acesso negado',
          code: 'FORBIDDEN'
        })
        return
      }

      logger.debug('Verificação de pergunta de segurança', { 
        userId,
        requestedBy: requestingUserId,
        ip: req.ip
      })

      const hasSecurityQuestion = await this.userService.hasSecurityQuestion(userId)

      res.json({
        success: true,
        message: 'Status da pergunta de segurança verificado',
        data: {
          user_id: userId,
          has_security_question: hasSecurityQuestion
        }
      })

    } catch (error: any) {
      logger.error('Erro ao verificar pergunta de segurança:', {
        error: error.message,
        stack: error.stack,
        userId: req.params.userId,
        ip: req.ip
      })

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor. Tente novamente mais tarde.',
        code: 'INTERNAL_ERROR'
      })
    }
  }




 async getSecurityQuestionByEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Validar dados de entrada
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        logger.warn('Dados inválidos na busca por pergunta de segurança', {
          errors: errors.array(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        })

        res.status(400).json({
          success: false,
          error: 'Dados inválidos fornecidos',
          details: errors.array(),
          code: 'VALIDATION_ERROR'
        })
        return
      }

      const { email } = req.body

      // Log da tentativa
      logger.info('Solicitação de pergunta de segurança iniciada', { 
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      })

      
      const securityData = await this.userService.getSecurityQuestionByEmail(email)

     
      if (!securityData) {
        logger.warn('Tentativa de busca por pergunta - email não encontrado ou sem pergunta', { 
          email,
          ip: req.ip,
          timestamp: new Date().toISOString()
        })

        
        res.status(404).json({
          success: false,
          error: 'Não foi possível localizar uma pergunta de segurança associada a este email. Verifique se:\n• O email está correto\n• Você possui uma conta cadastrada\n• Configurou uma pergunta de segurança',
          code: 'SECURITY_QUESTION_NOT_FOUND',
          help: {
            message: 'Se você não configurou uma pergunta de segurança, entre em contato com o suporte.',
            support_contact: 'suporte@empresa.com'
          }
        })
        return
      }

     
      logger.info('Pergunta de segurança localizada e enviada', { 
        email: securityData.email,
        questionLength: securityData.security_question.length,
        ip: req.ip,
        timestamp: new Date().toISOString()
      })

      res.status(200).json({
        success: true,
        message: 'Pergunta de segurança localizada com sucesso',
        data: {
          email: securityData.email,
          security_question: securityData.security_question,
          instructions: 'Responda a pergunta de segurança exatamente como você a cadastrou. A resposta é sensível a maiúsculas e minúsculas.'
        },
        next_step: {
          action: 'submit_answer',
          endpoint: '/api/password-reset/reset-password',
          required_fields: ['email', 'security_answer', 'new_password']
        }
      })

    } catch (error: any) {
      // Log do erro detalhado
      logger.error('Erro crítico ao buscar pergunta de segurança', {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        request: {
          email: req.body?.email,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          method: req.method,
          url: req.originalUrl
        },
        timestamp: new Date().toISOString()
      })

      
      res.status(500).json({
        success: false,
        error: 'Ocorreu um erro interno do servidor. Nossa equipe foi notificada e está trabalhando para resolver o problema.',
        code: 'INTERNAL_SERVER_ERROR',
        support: {
          message: 'Se o problema persistir, entre em contato com o suporte técnico.',
          reference_id: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      })
    }
  }


  

}

export default UserController