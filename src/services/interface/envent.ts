// src/services/eventService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateEventData {
  campaignId?: string;
  eventName: string;
  eventAction?: string;
  eventCategory?: string;
  eventLabel?: string;
  value?: number;
  currency?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  gaClientId?: string;
  ga4MeasurementId?: string;
  pageUrl?: string;
  pageTitle?: string;
  eventTime?: Date;
}

export interface EventFilters {
  campaignId?: string;
  eventName?: string;
  eventCategory?: string;
  startDate?: Date;
  endDate?: Date;
  utmSource?: string;
  utmCampaign?: string;
  page?: number;
  limit?: number;
}

export class EventService {
  // Criar evento
  static async createEvent(data: CreateEventData) {
    try {
      // Validar se campanha existe (se fornecida)
      if (data.campaignId) {
        const campaign = await prisma.campaign.findUnique({
          where: { id: data.campaignId }
        });
        
        if (!campaign) {
          throw new Error('Campanha não encontrada');
        }
      }

      const event = await prisma.event.create({
        data: {
          campaignId: data.campaignId,
          eventName: data.eventName,
          eventAction: data.eventAction,
          eventCategory: data.eventCategory,
          eventLabel: data.eventLabel,
          value: data.value,
          currency: data.currency || 'BRL',
          userId: data.userId,
          sessionId: data.sessionId,
          userAgent: data.userAgent,
          ipAddress: data.ipAddress,
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign,
          utmTerm: data.utmTerm,
          utmContent: data.utmContent,
          referrer: data.referrer,
          gaClientId: data.gaClientId,
          ga4MeasurementId: data.ga4MeasurementId,
          pageUrl: data.pageUrl,
          pageTitle: data.pageTitle,
          eventTime: data.eventTime || new Date(),
        },
        include: {
          campaign: true
        }
      });

      return event;
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar o evento: ${error.message}`);
  }
  throw new Error('Erro ao criar evento: erro desconhecido');
}
  }

  // Criar múltiplos eventos (batch)
  static async createEventsBatch(events: CreateEventData[]) {
    try {
      const createdEvents = await prisma.event.createMany({
        data: events.map(event => ({
          campaignId: event.campaignId,
          eventName: event.eventName,
          eventAction: event.eventAction,
          eventCategory: event.eventCategory,
          eventLabel: event.eventLabel,
          value: event.value,
          currency: event.currency || 'BRL',
          userId: event.userId,
          sessionId: event.sessionId,
          userAgent: event.userAgent,
          ipAddress: event.ipAddress,
          utmSource: event.utmSource,
          utmMedium: event.utmMedium,
          utmCampaign: event.utmCampaign,
          utmTerm: event.utmTerm,
          utmContent: event.utmContent,
          referrer: event.referrer,
          gaClientId: event.gaClientId,
          ga4MeasurementId: event.ga4MeasurementId,
          pageUrl: event.pageUrl,
          pageTitle: event.pageTitle,
          eventTime: event.eventTime || new Date(),
        }))
      });

      return {
        count: createdEvents.count,
        message: `${createdEvents.count} eventos criados com sucesso`
      };
  } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar o evento: ${error.message}`);
  }
  throw new Error('Erro ao criar evento: erro desconhecido');
}
  }

  // Buscar eventos com filtros
  static async getEvents(filters: EventFilters = {}) {
    try {
      const page = filters.page || 1;
      const limit = filters.limit || 50;
      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (filters.campaignId) where.campaignId = filters.campaignId;
      if (filters.eventName) where.eventName = filters.eventName;
      if (filters.eventCategory) where.eventCategory = filters.eventCategory;
      if (filters.utmSource) where.utmSource = filters.utmSource;
      if (filters.utmCampaign) where.utmCampaign = filters.utmCampaign;
      
      if (filters.startDate || filters.endDate) {
        where.eventTime = {};
        if (filters.startDate) where.eventTime.gte = filters.startDate;
        if (filters.endDate) where.eventTime.lte = filters.endDate;
      }

      const [events, total] = await Promise.all([
        prisma.event.findMany({
          where,
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
                platform: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { eventTime: 'desc' }
        }),
        prisma.event.count({ where })
      ]);

      return {
        events,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
      } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar o evento: ${error.message}`);
  }
  throw new Error('Erro ao criar evento: erro desconhecido');
}
  }

  // Buscar evento por ID
  static async getEventById(id: string) {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
        include: {
          campaign: true
        }
      });

      if (!event) {
        throw new Error('Evento não encontrado');
      }

      return event;
      } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar o evento: ${error.message}`);
  }
  throw new Error('Erro ao criar evento: erro desconhecido');
}
  }

  // Estatísticas de eventos
 static async getEventStats(filters: {
    campaignId?: string;
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'hour' | 'eventName' | 'utmSource';
  } = {}) {
    try {
      const where: any = {};
      
      if (filters.campaignId) where.campaignId = filters.campaignId;
      if (filters.startDate || filters.endDate) {
        where.eventTime = {};
        if (filters.startDate) where.eventTime.gte = filters.startDate;
        if (filters.endDate) where.eventTime.lte = filters.endDate;
      }

      // Define types for the grouped data
      type EventByName = {
        eventName: string;
        _count: { id: number };
        _sum: { value: number | null };
      };

      type EventBySource = {
        utmSource: string | null;
        _count: { id: number };
        _sum: { value: number | null };
      };

      type EventByCampaign = {
        utmCampaign: string | null;
        _count: { id: number };
        _sum: { value: number | null };
      };

      // Estatísticas básicas
      const totalEvents = await prisma.event.count({ where });
      
      const totalValue = await prisma.event.aggregate({
        where: {
          ...where,
          value: { not: null }
        },
        _sum: { value: true },
        _avg: { value: true }
      });

      const uniqueUsers = await prisma.event.groupBy({
        by: ['userId'],
        where: {
          ...where,
          userId: { not: null }
        },
        _count: { userId: true }
      });

      // Agrupamentos por tipo de evento
      const eventsByName = await prisma.event.groupBy({
        by: ['eventName'],
        where,
        _count: { id: true },
        _sum: { value: true },
        orderBy: { _count: { id: 'desc' } }
      }) as EventByName[];

      // Agrupamentos por origem UTM
      const eventsBySource = await prisma.event.groupBy({
        by: ['utmSource'],
        where: {
          ...where,
          utmSource: { not: null }
        },
        _count: { id: true },
        _sum: { value: true },
        orderBy: { _count: { id: 'desc' } }
      }) as EventBySource[];

      // Agrupamentos por campanha UTM
      const eventsByCampaign = await prisma.event.groupBy({
        by: ['utmCampaign'],
        where: {
          ...where,
          utmCampaign: { not: null }
        },
        _count: { id: true },
        _sum: { value: true },
        orderBy: { _count: { id: 'desc' } }
      }) as EventByCampaign[];

      return {
        summary: {
          totalEvents,
          totalValue: totalValue._sum.value || 0,
          averageValue: totalValue._avg.value || 0,
          uniqueUsers: uniqueUsers.length
        },
        breakdowns: {
          byEventName: eventsByName.map((item: EventByName) => ({
            eventName: item.eventName,
            count: item._count.id,
            totalValue: item._sum.value || 0
          })),
          bySource: eventsBySource.map((item: EventBySource) => ({
            source: item.utmSource,
            count: item._count.id,
            totalValue: item._sum.value || 0
          })),
          byCampaign: eventsByCampaign.map((item: EventByCampaign) => ({
            campaign: item.utmCampaign,
            count: item._count.id,
            totalValue: item._sum.value || 0
          }))
        }
      };
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas de eventos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Buscar eventos por sessão
  static async getEventsBySession(sessionId: string) {
    try {
      const events = await prisma.event.findMany({
        where: { sessionId },
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              platform: true
            }
          }
        },
        orderBy: { eventTime: 'asc' }
      });

      return events;
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas de eventos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Deletar eventos antigos
  static async deleteOldEvents(daysOld: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deletedEvents = await prisma.event.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      });

      return {
        count: deletedEvents.count,
        message: `${deletedEvents.count} eventos antigos deletados`
      };
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas de eventos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Funnel de conversão
  static async getConversionFunnel(
    steps: string[], 
    filters: { 
      campaignId?: string; 
      startDate?: Date; 
      endDate?: Date; 
    } = {}
  ) {
    try {
      const where: any = {};
      
      if (filters.campaignId) where.campaignId = filters.campaignId;
      if (filters.startDate || filters.endDate) {
        where.eventTime = {};
        if (filters.startDate) where.eventTime.gte = filters.startDate;
        if (filters.endDate) where.eventTime.lte = filters.endDate;
      }
type FunnelStep = {
  step: number;
  eventName: string;
  totalEvents: number;
  uniqueUsers: number;
  conversionRate: number | string; // string se você quer usar `.toFixed(2)`
};

const funnelData: FunnelStep[] = [];

for (let i = 0; i < steps.length; i++) {
  const stepWhere = {
    ...where,
    eventName: steps[i]
  };

  const stepCount = await prisma.event.count({ where: stepWhere });
  const uniqueUsers = await prisma.event.groupBy({
    by: ['userId'],
    where: {
      ...stepWhere,
      userId: { not: null }
    }
  });

  funnelData.push({
    step: i + 1,
    eventName: steps[i],
    totalEvents: stepCount,
    uniqueUsers: uniqueUsers.length,
    conversionRate: i === 0
      ? 100
      : Number(((stepCount / funnelData[0].totalEvents) * 100).toFixed(2)) // converte de volta para número
  });
}


      return funnelData;
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas de eventos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}