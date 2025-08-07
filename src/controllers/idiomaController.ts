import { Request, Response } from 'express';
import { langnativeService } from '../services/interface/Idioma';
import { AuthenticatedRequest } from '../utils/interface/auth_idioma.interface';
const langNativeService = new langnativeService();
export class LangNativeController {
    
  //lista todos os idiomas

  async getAllLangNatives(req: Request, res: Response): Promise<void> {
    try {
      const result = await langNativeService.getAlllangnatives();

      if (result.success) {
         res.status(200).json({
          success: true,
          data: result.data,
          message: result.message,
        });
      } else {
         res.status(500).json({
          success: false,
          data: null,
          message: result.message,
        });
      }
    } catch (error) {
      console.error('Erro no controller getAllLangNatives:', error);
       res.status(500).json({
        success: false,
        data: null,
        message: 'Erro interno do servidor',
      });
    }
  }


  
  async getAvailableLanguagesToLearn(req: Request, res: Response):Promise<void> {
    try {
      const langNativeCode = req.query.lang_native as string;

      
      if (!langNativeCode) {
         res.status(400).json({
          success: false,
          data: null,
          message: 'Parâmetro lang_native é obrigatório'
        });
      }

      
      if (langNativeCode.length < 2 || langNativeCode.length > 5) {
         res.status(400).json({
          success: false,
          data: null,
          message: 'Código do idioma nativo deve ter entre 2 e 5 caracteres'
        });
      }

      const result = await langNativeService.getAvailableLanguagesToLearn(langNativeCode);
      
      if (result.success) {
         res.status(200).json(result);
      } else {
        // Se o idioma não foi encontrado, retorna 404
        if (result.message === 'Idioma nativo não encontrado') {
          res.status(404).json(result);
        }
        // Outros erros retornam 500
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Erro no controller ao buscar idiomas disponíveis:', error);
      res.status(500).json({
        success: false,
        data: null,
        message: 'Erro interno do servidor'
      });
    }
  }

   async updateLangNative(req: Request, res: Response): Promise<void> {
    try {
      const { lang_code } = req.params;
      const updateData = req.body;

      if (!lang_code) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Código do idioma é obrigatório'
        });
        return;
      }

      // Validação básica dos dados de atualização
      if (!updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'Dados para atualização são obrigatórios'
        });
        return;
      }

      const result = await langNativeService.updatelangnative(lang_code, updateData);

      if (result.success) {
        res.status(200).json(result);
      } else {
        if (result.message === 'Idioma nativo não encontrado') {
          res.status(404).json(result);
        } else {
          res.status(400).json(result);
        }
      }
    } catch (error) {
      console.error('Erro no controller ao atualizar idioma nativo:', error);
      res.status(500).json({
        success: false,
        data: null,
        message: 'Erro interno do servidor'
      });
    }
  }

async getLessonById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const lessonId = parseInt(req.params.id);
      
      // Valida se o ID é um número válido
      if (isNaN(lessonId)) {
        res.status(400).json({
          success: false,
          data: null,
          message: 'ID da lição deve ser um número válido'
        });
        return;
      }

      // Busca a lição
      const lessonResult = await langNativeService.getLessonById(lessonId);
      
      if (!lessonResult.success) {
        res.status(404).json({
          success: false,
          data: null,
          message: lessonResult.message
        });
        return;
      }

      const lesson = lessonResult.data;
      const lessonAccess = parseInt(lesson.lesson_access);

      // Verifica o controle de acesso
      const accessResult = await this.checkLessonAccess(lessonAccess, req.user);
      
      if (!accessResult.hasAccess) {
        res.status(403).json({
          success: false,
          data: null,
          message: accessResult.message
        });
        return;
      }

      // Retorna a lição com sucesso
      res.status(200).json({
        success: true,
        data: lesson,
        message: 'Lição carregada com sucesso'
      });

    } catch (error) {
      console.error('Erro no controller getLessonById:', error);
      res.status(500).json({
        success: false,
        data: null,
        message: 'Erro interno do servidor'
      });
    }
  }

  private async checkLessonAccess(
    lessonAccess: number, 
    user?: any
  ): Promise<{ hasAccess: boolean; message: string }> {
    
    switch (lessonAccess) {
      case 1:
        // Acesso público - qualquer pessoa pode acessar
        return {
          hasAccess: true,
          message: 'Acesso permitido'
        };
      
      case 2:
        // Acesso apenas para usuários logados
        if (!user) {
          return {
            hasAccess: false,
            message: 'Acesso restrito a usuários autenticados'
          };
        }
        return {
          hasAccess: true,
          message: 'Acesso permitido'
        };
      
      case 3:
        // Acesso apenas para usuários premium
        if (!user) {
          return {
            hasAccess: false,
            message: 'Acesso restrito a usuários premium'
          };
        }
        
        if (!user.is_premium) {
          return {
            hasAccess: false,
            message: 'Acesso restrito a usuários premium'
          };
        }
        
        return {
          hasAccess: true,
          message: 'Acesso permitido'
        };
      
      default:
        return {
          hasAccess: false,
          message: 'Nível de acesso não reconhecido'
        };
    }
  }

  
}




