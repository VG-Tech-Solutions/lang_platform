import { Request, Response } from 'express';
import { LangNativeService } from '../services/interface/Idioma';
const langNativeService = new LangNativeService();
export class LangNativeController {
    
  //lista todos os idiomas

  async getAllLangNatives(req: Request, res: Response): Promise<void> {
    try {
      const result = await langNativeService.getAllLangNatives();

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


  //idioma por parâmetro
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
}



