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


  


}

export default UserController