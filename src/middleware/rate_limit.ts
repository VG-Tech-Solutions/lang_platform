import rateLimit from 'express-rate-limit';

// Rate limit geral
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 requests por IP por janela
  message: {
    error: 'Muitas requisições. Tente novamente em 15 minutos.',
    resetTime: new Date(Date.now() + 15 * 60 * 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit para tracking (mais permissivo)
export const trackingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // máximo 100 events por IP por minuto
  message: {
    error: 'Limite de tracking excedido. Tente novamente em 1 minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit para criação de campanhas (mais restritivo)
export const campaignLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // máximo 50 campanhas por IP por hora
  message: {
    error: 'Limite de criação de campanhas excedido. Tente novamente em 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});