import { Request, Response } from 'express';
import lessonService from '../services/lessonService';
import { ApiResponse } from '../types/types';

export class LessonController {
  getAllLessons = async (req: Request, res: Response): Promise<void> => {
    try {
      const { lang_native } = req.query;
      
      const lessons = await lessonService.getAllLessons(lang_native as string);
      
      const response: ApiResponse<typeof lessons> = {
        success: true,
        data: lessons
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      };
      
      res.status(500).json(response);
    }
  }

  getLessonTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { lang_native, lang_learn } = req.query;
      
      const types = await lessonService.getLessonTypes(
        id, 
        lang_native as string, 
        lang_learn as string
      );
      
      const response: ApiResponse<typeof types> = {
        success: true,
        data: types
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      };
      
      const statusCode = error instanceof Error && error.message === 'Lição não encontrada' ? 404 : 500;
      res.status(statusCode).json(response);
    }
  }

  getLessonContent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { lesson_type, lang_native, lang_learn } = req.query;
      
      if (!lesson_type) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'lesson_type é obrigatório'
        };
        res.status(400).json(response);
        return;
      }
      
      const content = await lessonService.getLessonContent(
        id,
        lesson_type as string,
        lang_native as string,
        lang_learn as string
      );
      
      const response: ApiResponse<typeof content> = {
        success: true,
        data: content
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor'
      };
      
      const statusCode = error instanceof Error && error.message === 'Lição não encontrada' ? 404 : 500;
      res.status(statusCode).json(response);
    }
  }
}

export default new LessonController();