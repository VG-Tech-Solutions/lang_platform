
import prisma from '../../config/database'
import { User } from '../../types/user'
import logger from '../../types/logger'

export class UserService {
  async createUser(userData: Omit<User, 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      const user = await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          lang_native: userData.lang_native,
          is_premium: userData.is_premium,
          stripe_customer_id: userData.stripe_customer_id,
          subscription_status: userData.subscription_status,
          subscription_renewal: userData.subscription_renewal,
          password: userData.password
        }
      })

      logger.info('Usuário criado com sucesso', { 
        userId: user.id,
        email: user.email 
      })
      
      return user
    } catch (error: any) {
      logger.error('Erro ao criar usuário:', {
        error: error.message,
        userData: { id: userData.id, email: userData.email }
      })
      
      // Se for erro de duplicação, não é um erro crítico
      if (error.code === 'P2002') {
        logger.warn('Tentativa de criar usuário já existente', { 
          userId: userData.id 
        })
        return null
      }
      
      throw error
    }
  }

  async getUserById(id: string): Promise<User | null> {
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

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...updates,
          
        }
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
      
      // Se usuário não encontrado
      if (error.code === 'P2025') {
        return null
      }
      
      throw error
    }
  }

  async deleteUser(id: string): Promise<boolean> {
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
      
      // Se usuário não encontrado
      if (error.code === 'P2025') {
        return false
      }
      
      throw error
    }
  }

  async createUserIfNotExists(authUser: any): Promise<User | null> {
    try {
      // Verificar se usuário já existe
      const existingUser = await this.getUserById(authUser.id)
      
      if (existingUser) {
        logger.debug('Usuário já existe', { userId: authUser.id })
        return existingUser
      }

      // Criar novo usuário
      const userData: Omit<User, 'created_at' | 'updated_at'> = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email,
        lang_native: 'pt-BR',
        is_premium: false,
        stripe_customer_id: null,
        subscription_status: null,
        subscription_renewal: null,
         password: ''
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
}