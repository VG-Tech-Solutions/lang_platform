 
import { PrismaClient } from '../../generated/prisma';
import { langnative, langlearn } from '../../generated/prisma';
import { LessonServiceResponse } from '../../utils/interface/idioma.interface';
const prisma = new PrismaClient();

export class langnativeService {
  // Lista todos os idiomas
  async getAlllangnatives() {
    try {
      const langnatives = await prisma.langnative.findMany({
        orderBy: {
          native_order: 'asc'
        }
      });

      return {
        success: true,
        data: langnatives,
        message: 'Idiomas nativos listados com sucesso'
      };
    } catch (error) {
      console.error('Erro ao buscar idiomas nativos:', error);
      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor'
      };
    }
  }

  // Lista os idiomas disponíveis para aprendizado com base no idioma nativo
  async getAvailableLanguagesToLearn(langnativeCode: string) {
    try {
      // Busca o idioma nativo pelo código
      const nativeLang = await prisma.langnative.findUnique({
        where: {
          lang_code: langnativeCode
        }
      });

      if (!nativeLang) {
        return {
          success: false,
          data: null,
          message: 'Idioma nativo não encontrado'
        };
      }

      // Busca os idiomas disponíveis para aprendizado na tabela langlearn
      const langLearnOptions = await prisma.langlearn.findMany({
        where: {
          lang_code: langnativeCode
        }
      });

      if (langLearnOptions.length === 0) {
        return {
          success: true,
          data: {
            native_language: nativeLang,
            available_languages: [],
            total: 0
          },
          message: 'Nenhum idioma disponível para aprendizado encontrado'
        };
      }

      // Extrai os códigos dos idiomas que podem ser aprendidos
      const learnCodes = langLearnOptions.map((option: langlearn) => option.learn_code);

      // Busca os idiomas correspondentes aos códigos extraídos
      const availableLanguages: langnative[] = await prisma.langnative.findMany({
        where: {
          lang_code: {
            in: learnCodes
          }
        },
        orderBy: {
          native_order: 'asc'
        }
      });

      // Enriquecendo os idiomas com o título de aprendizado
      const enrichedLanguages = availableLanguages.map((lang: langnative) => {
        const learnOption = langLearnOptions.find((option: langlearn) => option.learn_code === lang.lang_code);
        return {
          ...lang,
          learn_title: learnOption?.learn_title || lang.lang_name
        };
      });

      return {
        success: true,
        data: {
          native_language: nativeLang,
          available_languages: enrichedLanguages,
          total: enrichedLanguages.length
        },
        message: 'Idiomas disponíveis para aprendizado listados com sucesso'
      };
    } catch (error) {
      console.error('Erro ao buscar idiomas disponíveis:', error);
      return {
        success: false,
        data: null,
        message: 'Erro interno do servidor'
      };
    }
  }
  async updatelangnative(lang_code: string, updateData: Partial<langnative>) {
    try {
      // Verifica se o idioma existe
      const existingLang = await prisma.langnative.findUnique({
        where: { lang_code }
      });

      if (!existingLang) {
        return {
          success: false,
          data: null,
          message: 'Idioma nativo não encontrado'
        };
      }

      // Atualiza o idioma
      const updatedLang = await prisma.langnative.update({
        where: { lang_code },
        data: updateData
      });

      return {
        success: true,
        data: updatedLang,
        message: 'Idioma nativo atualizado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao atualizar idioma nativo:', error);
      return {
        success: false,
        data: null,
        message: 'Erro ao atualizar idioma nativo'
      };
    }
  }

  async getLessonById(id: number): Promise<LessonServiceResponse> {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: {
          lessoncontent: {
            orderBy: {
              play_order: 'asc'
            }
          }
        }
      });

      if (!lesson) {
        return {
          success: false,
          message: 'Lição não encontrada'
        };
      }

      return {
        success: true,
        data: lesson,
        message: 'Lição encontrada com sucesso'
      };
    } catch (error) {
      console.error('Erro ao buscar lição:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }

  async getUserById(userId: number): Promise<LessonServiceResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          lang_native: true,
          is_premium: true,
          subscription_status: true
        }
      });

      if (!user) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      return {
        success: true,
        data: user,
        message: 'Usuário encontrado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return {
        success: false,
        message: 'Erro interno do servidor'
      };
    }
  }
}