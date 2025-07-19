
// import prisma from '../../config/database'
// import { User } from '../../types/user'
// import logger from '../../types/logger'
// import bcrypt from 'bcrypt'
// export class UserService {
//   async createUser(userData: Omit<User, 'created_at' | 'updated_at'>): Promise<User | null> {
//     try {
//       const hashedPassword = await bcrypt.hash(userData.password, 10)
//       const user = await prisma.user.create({
//         data: {
          
//           email: userData.email,
//           name: userData.name,
//           lang_native: userData.lang_native,
//           is_premium: userData.is_premium,
//           stripe_customer_id: userData.stripe_customer_id,
//           subscription_status: userData.subscription_status,
//           subscription_renewal: userData.subscription_renewal,
//           password: hashedPassword
//         }
//       })

//       logger.info('Usuário criado com sucesso', { 
//         userId: user.id,
//         email: user.email 
//       })
      
//       return user
//     } catch (error: any) {
//       logger.error('Erro ao criar usuário:', {
//         error: error.message,
//         userData: { id: userData.id, email: userData.email }
//       })
      
//       // Se for erro de duplicação, não é um erro crítico
//       if (error.code === 'P2002') {
//         logger.warn('Tentativa de criar usuário já existente', { 
//           userId: userData.id 
//         })
//         return null
//       }
      
//       throw error
//     }
//   }

//   async getUserById(id: number): Promise<User | null> {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id }
//       })
      
//       if (user) {
//         logger.debug('Usuário encontrado por ID', { userId: id })
//       }
      
//       return user
//     } catch (error) {
//       logger.error('Erro ao buscar usuário por ID:', {
//         error,
//         userId: id
//       })
//       return null
//     }
//   }

//   async getUserByEmail(email: string): Promise<User | null> {
//     try {
//       const user = await prisma.user.findUnique({
//         where: { email }
//       })
      
//       if (user) {
//         logger.debug('Usuário encontrado por email', { email })
//       }
      
//       return user
//     } catch (error) {
//       logger.error('Erro ao buscar usuário por email:', {
//         error,
//         email
//       })
//       return null
//     }
//   }

//   async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
//     try {
//       const user = await prisma.user.update({
//         where: { id },
//         data: {
//           ...updates,
          
//         }
//       })

//       logger.info('Usuário atualizado com sucesso', { 
//         userId: id,
//         updatedFields: Object.keys(updates)
//       })
      
//       return user
//     } catch (error: any) {
//       logger.error('Erro ao atualizar usuário:', {
//         error: error.message,
//         userId: id,
//         updates
//       })
      
//       // Se usuário não encontrado
//       if (error.code === 'P2025') {
//         return null
//       }
      
//       throw error
//     }
//   }

  

//   async updateEmail(id: number, newEmail: string): Promise<User | null> {
//     try {
//       const user = await prisma.user.update({
//         where: { id },
//         data: { email: newEmail }
//       })

//       logger.info('Email do usuário atualizado com sucesso', { 
//         userId: id,
//         newEmail 
//       })
      
//       return user
//     } catch (error: any) {
//       logger.error('Erro ao atualizar email do usuário:', {
//         error: error.message,
//         userId: id,
//         newEmail
//       })
      
      
//       if (error.code === 'P2025') {
//         return null
//       }
      
//       throw error
//     }
//   }

//   async deleteUser(id: number): Promise<boolean> {
//     try {
//       await prisma.user.delete({
//         where: { id }
//       })

//       logger.info('Usuário deletado com sucesso', { userId: id })
//       return true
//     } catch (error: any) {
//       logger.error('Erro ao deletar usuário:', {
//         error: error.message,
//         userId: id
//       })
      
//       // Se usuário não encontrado
//       if (error.code === 'P2025') {
//         return false
//       }
      
//       throw error
//     }
//   }

//   async createUserIfNotExists(authUser: any): Promise<User | null> {
//     try {
//       // Verificar se usuário já existe
//       const existingUser = await this.getUserById(authUser.id)
      
//       if (existingUser) {
//         logger.debug('Usuário já existe', { userId: authUser.id })
//         return existingUser
//       }

//       // Criar novo usuário
//       const userData: Omit<User, 'created_at' | 'updated_at'> = {
//         id: authUser.id,
//         email: authUser.email,
//         name: authUser.user_metadata?.full_name || authUser.email,
//         lang_native: 'pt-BR',
//         is_premium: false,
//         stripe_customer_id: null,
//         subscription_status: null,
//         subscription_renewal: null,
//          password: ''
//       }

//       const newUser = await this.createUser(userData)
      
//       if (newUser) {
//         logger.info('Novo usuário criado automaticamente', { 
//           userId: newUser.id,
//           email: newUser.email 
//         })
//       }
      
//       return newUser
//     } catch (error) {
//       logger.error('Erro ao criar usuário se não existir:', {
//         error,
//         authUserId: authUser.id
//       })
//       return null
//     }
//   }

//   async getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
//     try {
//       const users = await prisma.user.findMany({
//         take: limit,
//         skip: offset,
//         orderBy: {
         
//         }
//       })

//       logger.debug('Usuários listados', { 
//         count: users.length,
//         limit,
//         offset 
//       })
      
//       return users
//     } catch (error) {
//       logger.error('Erro ao listar usuários:', error)
//       return []
//     }
//   }

//   async getUserStats(): Promise<{
//     total: number
//     premium: number
//     free: number
//     newThisMonth: number
//   }> {
//     try {
//       const now = new Date()
//       const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

//       const [total, premium, newThisMonth] = await Promise.all([
//         prisma.user.count(),
//         prisma.user.count({ where: { is_premium: true } }),
//         prisma.user.count({ 
//           where: { 
           
//           } 
//         })
//       ])

//       const stats = {
//         total,
//         premium,
//         free: total - premium,
//         newThisMonth
//       }

//       logger.debug('Estatísticas de usuários calculadas', stats)
      
//       return stats
//     } catch (error) {
//       logger.error('Erro ao calcular estatísticas:', error)
//       return {
//         total: 0,
//         premium: 0,
//         free: 0,
//         newThisMonth: 0
//       }
//     }
//   }


// async getUserProfileWithLanguage(id: number): Promise<{
//   id: number
//   name: string
//   email: string
//   isPremium: boolean
//   nativeLanguage: {
//     code: string
//     name: string
//     nativeTitle: string
//     flag: string
//     order: number
//   }
//   subscription: {
//     status: string | null
//     renewal: Date | null
//   }
// } | null> {
//   try {
//     // Buscar usuário com join do idioma nativo
//     const userWithLanguage = await prisma.user.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         lang_native: true,
//         is_premium: true,
//         subscription_status: true,
//         subscription_renewal: true
//       }
//     })

//     if (!userWithLanguage) {
//       logger.warn('Usuário não encontrado para perfil', { userId: id })
//       return null
//     }

//     // Buscar detalhes do idioma nativo
//     const languageDetails = await prisma.langnative.findUnique({
//       where: { lang_code: userWithLanguage.lang_native }
//     })

//     // Montar resposta estruturada
//     const profile = {
//       id: userWithLanguage.id,
//       name: userWithLanguage.name,
//       email: userWithLanguage.email,
//       isPremium: userWithLanguage.is_premium,
//       nativeLanguage: languageDetails ? {
//         code: languageDetails.lang_code,
//         name: languageDetails.lang_name,
//         nativeTitle: languageDetails.native_title,
//         flag: languageDetails.lang_flag,
//         order: languageDetails.native_order
//       } : {
//         code: userWithLanguage.lang_native,
//         name: userWithLanguage.lang_native,
//         nativeTitle: userWithLanguage.lang_native,
//         flag: '',
//         order: 0
//       },
//       subscription: {
//         status: userWithLanguage.subscription_status,
//         renewal: userWithLanguage.subscription_renewal
//       }
//     }

//     logger.debug('Perfil do usuário montado com sucesso', { 
//       userId: id,
//       hasLanguageDetails: !!languageDetails
//     })

//     return profile

//   } catch (error: any) {
//     logger.error('Erro ao buscar perfil completo do usuário:', {
//       error: error.message,
//       userId: id
//     })
//     return null
//   }
// }

// // Método para listar todos os idiomas disponíveis
// async getAvailableLanguages(): Promise<{
//   code: string
//   name: string
//   nativeTitle: string
//   flag: string
//   order: number
// }[]> {
//   try {
//     const languages = await prisma.langnative.findMany({
//       orderBy: { native_order: 'asc' }
//     })

//     const formattedLanguages = languages.map(lang => ({
//       code: lang.lang_code,
//       name: lang.lang_name,
//       nativeTitle: lang.native_title,
//       flag: lang.lang_flag,
//       order: lang.native_order
//     }))

//     logger.debug('Idiomas disponíveis listados', { 
//       count: formattedLanguages.length 
//     })

//     return formattedLanguages

//   } catch (error: any) {
//     logger.error('Erro ao buscar idiomas disponíveis:', {
//       error: error.message
//     })
//     return []
//   }
// }

// // Método para validar se um idioma nativo existe
// async validateNativeLanguage(langCode: string): Promise<boolean> {
//   try {
//     const language = await prisma.langnative.findUnique({
//       where: { lang_code: langCode }
//     })

//     return !!language

//   } catch (error: any) {
//     logger.error('Erro ao validar idioma nativo:', {
//       error: error.message,
//       langCode
//     })
//     return false
//   }
// }

// }





import prisma from '../../config/database'
import { User, SecurityQuestionData, PasswordResetData, SecurityQuestionSetup } from '../../types/user'
import logger from '../../types/logger'
import bcrypt from 'bcrypt'

export class UserService {
  async createUser(userData: Omit<User, 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      
      // Se houver pergunta de segurança, hash da resposta
      let hashedSecurityAnswer = null
      if (userData.security_answer_hash) {
        hashedSecurityAnswer = await bcrypt.hash(userData.security_answer_hash, 10)
      }

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          lang_native: userData.lang_native,
          is_premium: userData.is_premium,
          stripe_customer_id: userData.stripe_customer_id,
          subscription_status: userData.subscription_status,
          subscription_renewal: userData.subscription_renewal,
          password: hashedPassword,
          security_question: userData.security_question,
          security_answer_hash: hashedSecurityAnswer
        }
      })

      logger.info('Usuário criado com sucesso', { 
        userId: user.id,
        email: user.email,
        hasSecurityQuestion: !!user.security_question
      })
      
      return user
    } catch (error: any) {
      logger.error('Erro ao criar usuário:', {
        error: error.message,
        userData: { id: userData.id, email: userData.email }
      })
      
      if (error.code === 'P2002') {
        logger.warn('Tentativa de criar usuário já existente', { 
          userId: userData.id 
        })
        return null
      }
      
      throw error
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })
      
      if (user) {
        logger.debug('Usuário encontrado por ID', { userId: id })
      }
      
      return user
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID:', {
        error,
        userId: id
      })
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (user) {
        logger.debug('Usuário encontrado por email', { email })
      }
      
      return user
    } catch (error) {
      logger.error('Erro ao buscar usuário por email:', {
        error,
        email
      })
      return null
    }
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    try {
      // Se estiver atualizando a senha, fazer hash
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10)
      }

      // Se estiver atualizando a resposta de segurança, fazer hash
      if (updates.security_answer_hash) {
        updates.security_answer_hash = await bcrypt.hash(updates.security_answer_hash, 10)
      }

      const user = await prisma.user.update({
        where: { id },
        data: updates
      })

      logger.info('Usuário atualizado com sucesso', { 
        userId: id,
        updatedFields: Object.keys(updates)
      })
      
      return user
    } catch (error: any) {
      logger.error('Erro ao atualizar usuário:', {
        error: error.message,
        userId: id,
        updates
      })
      
      if (error.code === 'P2025') {
        return null
      }
      
      throw error
    }
  }

  async updateEmail(id: number, newEmail: string): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { email: newEmail }
      })

      logger.info('Email do usuário atualizado com sucesso', { 
        userId: id,
        newEmail 
      })
      
      return user
    } catch (error: any) {
      logger.error('Erro ao atualizar email do usuário:', {
        error: error.message,
        userId: id,
        newEmail
      })
      
      if (error.code === 'P2025') {
        return null
      }
      
      throw error
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      })

      logger.info('Usuário deletado com sucesso', { userId: id })
      return true
    } catch (error: any) {
      logger.error('Erro ao deletar usuário:', {
        error: error.message,
        userId: id
      })
      
      if (error.code === 'P2025') {
        return false
      }
      
      throw error
    }
  }

  // ========== MÉTODOS PARA RECUPERAÇÃO DE SENHA ==========

  /**
   * Busca a pergunta de segurança por email
   */
  async getSecurityQuestionByEmail(email: string): Promise<SecurityQuestionData | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          email: true,
          security_question: true
        }
      })

      if (!user) {
        logger.warn('Usuário não encontrado para recuperação', { email })
        return null
      }

      if (!user.security_question) {
        logger.warn('Usuário não possui pergunta de segurança configurada', { email })
        return null
      }

      logger.info('Pergunta de segurança recuperada', { email })
      
      return {
        email: user.email,
        security_question: user.security_question
      }
    } catch (error: any) {
      logger.error('Erro ao buscar pergunta de segurança:', {
        error: error.message,
        email
      })
      return null
    }
  }

  /**
   * Verifica a resposta de segurança e permite redefinir senha
   */
  async resetPasswordWithSecurity(data: PasswordResetData): Promise<{
    success: boolean
    message: string
  }> {
    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: {
          id: true,
          email: true,
          security_question: true,
          security_answer_hash: true
        }
      })

      if (!user) {
        logger.warn('Tentativa de reset com usuário inexistente', { email: data.email })
        return {
          success: false,
          message: 'Usuário não encontrado'
        }
      }

      if (!user.security_question || !user.security_answer_hash) {
        logger.warn('Usuário sem pergunta de segurança configurada', { email: data.email })
        return {
          success: false,
          message: 'Pergunta de segurança não configurada'
        }
      }

      // Verificar resposta de segurança
      const isAnswerCorrect = await bcrypt.compare(
        data.security_answer.toLowerCase().trim(),
        user.security_answer_hash
      )

      if (!isAnswerCorrect) {
        logger.warn('Resposta de segurança incorreta', { 
          email: data.email,
          attempt: data.security_answer 
        })
        return {
          success: false,
          message: 'Resposta de segurança incorreta'
        }
      }

      // Atualizar senha
      const hashedNewPassword = await bcrypt.hash(data.new_password, 10)
      
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword }
      })

      logger.info('Senha redefinida com sucesso via pergunta de segurança', { 
        userId: user.id,
        email: data.email 
      })

      return {
        success: true,
        message: 'Senha redefinida com sucesso'
      }

    } catch (error: any) {
      logger.error('Erro ao redefinir senha:', {
        error: error.message,
        email: data.email
      })
      
      return {
        success: false,
        message: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Configura pergunta e resposta de segurança para usuário existente
   */
  async setSecurityQuestion(userId: number, data: SecurityQuestionSetup): Promise<{
    success: boolean
    message: string
  }> {
    try {
      // Hash da resposta de segurança
      const hashedAnswer = await bcrypt.hash(
        data.security_answer.toLowerCase().trim(),
        10
      )

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          security_question: data.security_question,
          security_answer_hash: hashedAnswer
        }
      })

      logger.info('Pergunta de segurança configurada', { 
        userId: user.id,
        email: user.email 
      })

      return {
        success: true,
        message: 'Pergunta de segurança configurada com sucesso'
      }

    } catch (error: any) {
      logger.error('Erro ao configurar pergunta de segurança:', {
        error: error.message,
        userId
      })

      if (error.code === 'P2025') {
        return {
          success: false,
          message: 'Usuário não encontrado'
        }
      }

      return {
        success: false,
        message: 'Erro interno do servidor'
      }
    }
  }

  /**
   * Verifica se usuário possui pergunta de segurança configurada
   */
  async hasSecurityQuestion(userId: number): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { security_question: true }
      })

      return !!(user?.security_question)
    } catch (error) {
      logger.error('Erro ao verificar pergunta de segurança:', {
        error,
        userId
      })
      return false
    }
  }

  

  async createUserIfNotExists(authUser: any): Promise<User | null> {
    try {
      const existingUser = await this.getUserById(authUser.id)
      
      if (existingUser) {
        logger.debug('Usuário já existe', { userId: authUser.id })
        return existingUser
      }

      const userData: Omit<User, 'created_at' | 'updated_at'> = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email,
        lang_native: 'pt-BR',
        is_premium: false,
        stripe_customer_id: null,
        subscription_status: null,
        subscription_renewal: null,
        password: '',
        security_question: null,
        security_answer_hash: null
      }

      const newUser = await this.createUser(userData)
      
      if (newUser) {
        logger.info('Novo usuário criado automaticamente', { 
          userId: newUser.id,
          email: newUser.email 
        })
      }
      
      return newUser
    } catch (error) {
      logger.error('Erro ao criar usuário se não existir:', {
        error,
        authUserId: authUser.id
      })
      return null
    }
  }

  async getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    try {
      const users = await prisma.user.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          created_at: 'desc'
        }
      })

      logger.debug('Usuários listados', { 
        count: users.length,
        limit,
        offset 
      })
      
      return users
    } catch (error) {
      logger.error('Erro ao listar usuários:', error)
      return []
    }
  }

  async getUserStats(): Promise<{
    total: number
    premium: number
    free: number
    newThisMonth: number
  }> {
    try {
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const [total, premium, newThisMonth] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { is_premium: true } }),
        prisma.user.count({ 
          where: { 
            created_at: {
              gte: firstDayOfMonth
            }
          } 
        })
      ])

      const stats = {
        total,
        premium,
        free: total - premium,
        newThisMonth
      }

      logger.debug('Estatísticas de usuários calculadas', stats)
      
      return stats
    } catch (error) {
      logger.error('Erro ao calcular estatísticas:', error)
      return {
        total: 0,
        premium: 0,
        free: 0,
        newThisMonth: 0
      }
    }
  }

  async getUserProfileWithLanguage(id: number): Promise<{
    id: number
    name: string
    email: string
    isPremium: boolean
    hasSecurityQuestion: boolean
    nativeLanguage: {
      code: string
      name: string
      nativeTitle: string
      flag: string
      order: number
    }
    subscription: {
      status: string | null
      renewal: Date | null
    }
  } | null> {
    try {
      const userWithLanguage = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          lang_native: true,
          is_premium: true,
          subscription_status: true,
          subscription_renewal: true,
          security_question: true
        }
      })

      if (!userWithLanguage) {
        logger.warn('Usuário não encontrado para perfil', { userId: id })
        return null
      }

      const languageDetails = await prisma.langnative.findUnique({
        where: { lang_code: userWithLanguage.lang_native }
      })

      const profile = {
        id: userWithLanguage.id,
        name: userWithLanguage.name,
        email: userWithLanguage.email,
        isPremium: userWithLanguage.is_premium,
        hasSecurityQuestion: !!userWithLanguage.security_question,
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

      logger.debug('Perfil do usuário montado com sucesso', { 
        userId: id,
        hasLanguageDetails: !!languageDetails,
        hasSecurityQuestion: profile.hasSecurityQuestion
      })

      return profile

    } catch (error: any) {
      logger.error('Erro ao buscar perfil completo do usuário:', {
        error: error.message,
        userId: id
      })
      return null
    }
  }

  async getAvailableLanguages(): Promise<{
    code: string
    name: string
    nativeTitle: string
    flag: string
    order: number
  }[]> {
    try {
      const languages = await prisma.langnative.findMany({
        orderBy: { native_order: 'asc' }
      })

      const formattedLanguages = languages.map(lang => ({
        code: lang.lang_code,
        name: lang.lang_name,
        nativeTitle: lang.native_title,
        flag: lang.lang_flag,
        order: lang.native_order
      }))

      logger.debug('Idiomas disponíveis listados', { 
        count: formattedLanguages.length 
      })

      return formattedLanguages

    } catch (error: any) {
      logger.error('Erro ao buscar idiomas disponíveis:', {
        error: error.message
      })
      return []
    }
  }

  async validateNativeLanguage(langCode: string): Promise<boolean> {
    try {
      const language = await prisma.langnative.findUnique({
        where: { lang_code: langCode }
      })

      return !!language

    } catch (error: any) {
      logger.error('Erro ao validar idioma nativo:', {
        error: error.message,
        langCode
      })
      return false
    }
  }
}