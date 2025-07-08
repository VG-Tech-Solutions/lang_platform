// src/services/langNativeService.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export class LangNativeService {
  //lista todos os idiomas
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
}