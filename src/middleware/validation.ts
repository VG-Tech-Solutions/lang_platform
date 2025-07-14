import { Request, Response, NextFunction } from 'express';

export const validateLanguages = (req: Request, res: Response, next: NextFunction): void => {
  const { lang_native, lang_learn } = req.query;
  
  const supportedLanguages = ['pt', 'en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh'];
  
  if (!lang_native || !lang_learn) {
    res.status(400).json({
      success: false,
      error: 'lang_native e lang_learn são obrigatórios'
    });
    return;
  }
  
  if (!supportedLanguages.includes(lang_native as string) || 
      !supportedLanguages.includes(lang_learn as string)) {
    res.status(400).json({
      success: false,
      error: 'Idiomas não suportados'
    });
    return;
  }
  
  next();
};

export const validateLessonId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (!id || id.trim() === '') {
    res.status(400).json({
      success: false,
      error: 'ID da lição é obrigatório'
    });
    return;
  }
  
  next();
};