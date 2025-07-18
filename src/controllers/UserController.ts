// import { Request, Response } from 'express';

// export default {
//   index(req: Request, res: Response) {
//     return res.json({ message: 'Lista de usuários' });
//   },

//   create(req: Request, res: Response) {
//     const { name } = req.body;
//     return res.status(201).json({ message: `Usuário ${name} criado!` });
//   },
// };





import { Request, Response } from 'express'
import { supabase } from '../config/supabase'
import { UserService } from '../services/interface/user'
import logger from '../types/logger'
import prisma from '../config/database' 
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


}

export default UserController