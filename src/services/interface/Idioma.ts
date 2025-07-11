// src/services/langNativeService.ts
import { PrismaClient } from '@prisma/client';
import { LangNative, LangLearn } from '../../generated/prisma';
const prisma = new PrismaClient();

export class LangNativeService {
  // Lista todos os idiomas
  async getAllLangNatives() {
    try {
      const langNatives = await prisma.langNative.findMany({
        orderBy: {
          native_order: 'asc'
        }
      });

      return {
        success: true,
        data: langNatives,
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
  async getAvailableLanguagesToLearn(langNativeCode: string) {
    try {
      // Busca o idioma nativo pelo código
      const nativeLang = await prisma.langNative.findUnique({
        where: {
          lang_code: langNativeCode
        }
      });

      if (!nativeLang) {
        return {
          success: false,
          data: null,
          message: 'Idioma nativo não encontrado'
        };
      }

      // Busca os idiomas disponíveis para aprendizado na tabela LangLearn
      const langLearnOptions = await prisma.langLearn.findMany({
        where: {
          lang_code: langNativeCode
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
      const learnCodes = langLearnOptions.map((option: LangLearn) => option.learn_code);

      // Busca os idiomas correspondentes aos códigos extraídos
      const availableLanguages: LangNative[] = await prisma.langNative.findMany({
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
      const enrichedLanguages = availableLanguages.map((lang: LangNative) => {
        const learnOption = langLearnOptions.find((option: LangLearn) => option.learn_code === lang.lang_code);
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
  async updateLangNative(lang_code: string, updateData: Partial<LangNative>) {
    try {
      // Verifica se o idioma existe
      const existingLang = await prisma.langNative.findUnique({
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
      const updatedLang = await prisma.langNative.update({
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
}