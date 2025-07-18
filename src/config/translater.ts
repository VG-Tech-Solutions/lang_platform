import { Request, Response, NextFunction } from 'express';

const antiTranslationHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Impede tradução automática do Google Chrome
  res.setHeader('Content-Language', 'pt-BR');

  // Impede tradução automática em geral
  res.setHeader('X-Robots-Tag', 'notranslate');

  // Header adicional para alguns navegadores
  res.setHeader('Cache-Control', 'no-translate');

  next();
};
export default antiTranslationHeaders