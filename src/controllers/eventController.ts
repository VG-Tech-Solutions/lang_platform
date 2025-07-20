// src/controllers/eventController.ts
import { Request, Response } from 'express';
import { EventService } from '../services/interface/envent';

export class EventController {
  // POST /events
  static async createEvent(req: Request, res: Response) {
    try {
      const {
        campaignId,
        eventName,
        eventAction,
        eventCategory,
        eventLabel,
        value,
        currency,
        userId,
        sessionId,
        userAgent,
        ipAddress,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        referrer,
        gaClientId,
        ga4MeasurementId,
        pageUrl,
        pageTitle,
        eventTime
      } = req.body;

      // Validações
      if (!eventName) {
        return res.status(400).json({
          error: 'eventName é obrigatório'
        });
      }

      // Capturar IP e User-Agent automaticamente se não fornecidos
      const finalIpAddress = ipAddress || req.ip || req.connection.remoteAddress;
      const finalUserAgent = userAgent || req.headers['user-agent'];

      const event = await EventService.createEvent({
        campaignId,
        eventName,
        eventAction,
        eventCategory,
        eventLabel,
        value,
        currency,
        userId,
        sessionId,
        userAgent: finalUserAgent,
        ipAddress: finalIpAddress,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        referrer,
        gaClientId,
        ga4MeasurementId,
        pageUrl,
        pageTitle,
        eventTime: eventTime ? new Date(eventTime) : undefined
      });

      res.status(201).json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // POST /events/batch
  static async createEventsBatch(req: Request, res: Response) {
    try {
      const { events } = req.body;

      if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({
          error: 'events deve ser um array com pelo menos um evento'
        });
      }

      // Validar cada evento
      for (let i = 0; i < events.length; i++) {
        if (!events[i].eventName) {
          return res.status(400).json({
            error: `eventName é obrigatório no evento ${i + 1}`
          });
        }
      }

      const result = await EventService.createEventsBatch(events);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Erro ao criar eventos em lote:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // GET /events
  static async getEvents(req: Request, res: Response) {
    try {
      const {
        campaignId,
        eventName,
        eventCategory,
        startDate,
        endDate,
        utmSource,
        utmCampaign,
        page = 1,
        limit = 50
      } = req.query;

      const filters: any = {};
      if (campaignId) filters.campaignId = campaignId as string;
      if (eventName) filters.eventName = eventName as string;
      if (eventCategory) filters.eventCategory = eventCategory as string;
      if (utmSource) filters.utmSource = utmSource as string;
      if (utmCampaign) filters.utmCampaign = utmCampaign as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      filters.page = parseInt(page as string);
      filters.limit = parseInt(limit as string);

      const result = await EventService.getEvents(filters);

      res.json({
        success: true,
        data: result.events,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // GET /events/:id
  static async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);

      res.json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // GET /events/stats
  static async getEventStats(req: Request, res: Response) {
    try {
      const {
        campaignId,
        startDate,
        endDate,
        groupBy
      } = req.query;

      const filters: any = {};
      if (campaignId) filters.campaignId = campaignId as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (groupBy) filters.groupBy = groupBy as string;

      const stats = await EventService.getEventStats(filters);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas de eventos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // GET /events/session/:sessionId
  static async getEventsBySession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const events = await EventService.getEventsBySession(sessionId);

      res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('Erro ao buscar eventos da sessão:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // DELETE /events/cleanup
  static async deleteOldEvents(req: Request, res: Response) {
    try {
      const { daysOld = 90 } = req.query;
      const result = await EventService.deleteOldEvents(parseInt(daysOld as string));

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Erro ao deletar eventos antigos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // POST /events/funnel
  static async getConversionFunnel(req: Request, res: Response) {
    try {
      const { steps, campaignId, startDate, endDate } = req.body;

      if (!Array.isArray(steps) || steps.length === 0) {
        return res.status(400).json({
          error: 'steps deve ser um array com pelo menos um evento'
        });
      }

      const filters: any = {};
      if (campaignId) filters.campaignId = campaignId;
      if (startDate) filters.startDate = new Date(startDate);
      if (endDate) filters.endDate = new Date(endDate);

      const funnel = await EventService.getConversionFunnel(steps, filters);

      res.json({
        success: true,
        data: funnel
      });
    } catch (error) {
      console.error('Erro ao calcular funil de conversão:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  // POST /events/track (endpoint simplificado para tracking via JavaScript)
  static async trackEvent(req: Request, res: Response) {
    try {
      const {
        eventName,
        eventCategory = 'engagement',
        eventAction = 'click',
        eventLabel,
        value,
        campaignId,
        userId,
        sessionId,
        gaClientId,
        pageUrl,
        pageTitle
      } = req.body;

      if (!eventName) {
        return res.status(400).json({
          error: 'eventName é obrigatório'
        });
      }

      // Capturar dados do request
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.connection.remoteAddress;
      const referrer = req.headers.referer || req.headers.referrer;

      // Extrair parâmetros UTM da URL se fornecida
      let utmParams = {};
      if (pageUrl) {
        const url = new URL(pageUrl);
        utmParams = {
          utmSource: url.searchParams.get('utm_source'),
          utmMedium: url.searchParams.get('utm_medium'),
          utmCampaign: url.searchParams.get('utm_campaign'),
          utmTerm: url.searchParams.get('utm_term'),
          utmContent: url.searchParams.get('utm_content')
        };
      }

      function normalizeToString(input?: string | string[]): string | undefined {
  if (Array.isArray(input)) return input[0]; 
  return input;
}
const event = await EventService.createEvent({
  eventName,
  eventCategory,
  eventAction,
  eventLabel,
  value,
  campaignId,
  userId,
  sessionId,
  userAgent,
  ipAddress,
  referrer: normalizeToString(referrer),
  gaClientId: normalizeToString(gaClientId),
  pageUrl: normalizeToString(pageUrl),
  pageTitle: normalizeToString(pageTitle),
  ...utmParams
});


      res.status(201).json({
        success: true,
        eventId: event.id,
        message: 'Evento rastreado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao rastrear evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}