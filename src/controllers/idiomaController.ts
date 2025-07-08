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
}

