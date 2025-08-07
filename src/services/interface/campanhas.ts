// src/services/campaignService.ts
import { PrismaClient, Platform, CampaignStatus } from '../../generated/prisma';

const prisma = new PrismaClient();

export interface CreateCampaignData {
  name: string;
  platform: Platform;
  status?: CampaignStatus;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  currency?: string;
  createdBy?: string;
}

export interface GoogleAdsTagData {
  gclid?: string;
  utm_campaign: string;
  utm_term?: string;
  utm_content?: string;
  adGroupId?: string;
  keywordId?: string;
  creativeId?: string;
}

export interface MetaAdsTagData {
  fbclid?: string;
  utm_campaign: string;
  utm_content?: string;
  adSetId?: string;
  adId?: string;
  placement?: string;
}

export interface XAdsTagData {
  twclid?: string;
  utm_campaign: string;
  utm_content?: string;
  tweetId?: string;
  lineItemId?: string;
}

export interface UpdateCampaignData {
  name?: string;
  status?: CampaignStatus;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  currency?: string;
}

export class CampaignService {
  // Criar campanha
  static async createCampaign(data: CreateCampaignData) {
    try {
      const campaign = await prisma.campaign.create({
        data: {
          name: data.name,
          platform: data.platform,
          status: data.status || CampaignStatus.ACTIVE,
          startDate: data.startDate,
          endDate: data.endDate,
          budget: data.budget,
          currency: data.currency || 'BRL',
          createdBy: data.createdBy,
        },
        include: {
          googleAds: true,
          metaAds: true,
          xAds: true,
        },
      });

    return campaign;
} catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Buscar campanhas com filtros
  static async getCampaigns(filters?: {
    platform?: Platform;
    status?: CampaignStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    try {
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (filters?.platform) where.platform = filters.platform;
      if (filters?.status) where.status = filters.status;
      if (filters?.startDate || filters?.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
      }

      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where,
          include: {
            googleAds: true,
            metaAds: true,
            xAds: true,
            _count: {
              select: { events: true }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.campaign.count({ where })
      ]);

      return {
        campaigns,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Buscar campanha por ID
  static async getCampaignById(id: string) {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          googleAds: true,
          metaAds: true,
          xAds: true,
          events: {
            take: 100,
            orderBy: { eventTime: 'desc' }
          }
        }
      });

      if (!campaign) {
        throw new Error('Campanha não encontrada');
      }

      return campaign;
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Atualizar campanha
  static async updateCampaign(id: string, data: UpdateCampaignData) {
    try {
      const campaign = await prisma.campaign.update({
        where: { id },
        data,
        include: {
          googleAds: true,
          metaAds: true,
          xAds: true,
        }
      });

      return campaign;
   } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Deletar campanha
  static async deleteCampaign(id: string) {
    try {
      await prisma.campaign.delete({
        where: { id }
      });
      
      return { message: 'Campanha deletada com sucesso' };
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Adicionar Google Ads Tag
  static async addGoogleAdsTag(campaignId: string, data: GoogleAdsTagData) {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
      });

      if (!campaign) {
        throw new Error('Campanha não encontrada');
      }

      if (campaign.platform !== Platform.GOOGLE_ADS) {
        throw new Error('Esta campanha não é do Google Ads');
      }

      const googleAdsTag = await prisma.googleAdsTag.create({
        data: {
          campaignId,
          gclid: data.gclid,
          utm_campaign: data.utm_campaign,
          utm_term: data.utm_term,
          utm_content: data.utm_content,
          adGroupId: data.adGroupId,
          keywordId: data.keywordId,
          creativeId: data.creativeId,
        }
      });

      return googleAdsTag;
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Adicionar Meta Ads Tag
  static async addMetaAdsTag(campaignId: string, data: MetaAdsTagData) {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
      });

      if (!campaign) {
        throw new Error('Campanha não encontrada');
      }

      if (campaign.platform !== Platform.META_ADS) {
        throw new Error('Esta campanha não é do Meta Ads');
      }

      const metaAdsTag = await prisma.metaAdsTag.create({
        data: {
          campaignId,
          fbclid: data.fbclid,
          utm_campaign: data.utm_campaign,
          utm_content: data.utm_content,
          adSetId: data.adSetId,
          adId: data.adId,
          placement: data.placement,
        }
      });

      return metaAdsTag;
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Adicionar X Ads Tag
  static async addXAdsTag(campaignId: string, data: XAdsTagData) {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
      });

      if (!campaign) {
        throw new Error('Campanha não encontrada');
      }

      if (campaign.platform !== Platform.X_ADS) {
        throw new Error('Esta campanha não é do X Ads');
      }

      const xAdsTag = await prisma.xAdsTag.create({
        data: {
          campaignId,
          twclid: data.twclid,
          utm_campaign: data.utm_campaign,
          utm_content: data.utm_content,
          tweetId: data.tweetId,
          lineItemId: data.lineItemId,
        }
      });

      return xAdsTag;
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Atualizar tags
  static async updateGoogleAdsTag(campaignId: string, data: Partial<GoogleAdsTagData>) {
    try {
      const googleAdsTag = await prisma.googleAdsTag.update({
        where: { campaignId },
        data
      });
      return googleAdsTag;
   } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  static async updateMetaAdsTag(campaignId: string, data: Partial<MetaAdsTagData>) {
    try {
      const metaAdsTag = await prisma.metaAdsTag.update({
        where: { campaignId },
        data
      });
      return metaAdsTag;
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  static async updateXAdsTag(campaignId: string, data: Partial<XAdsTagData>) {
    try {
      const xAdsTag = await prisma.xAdsTag.update({
        where: { campaignId },
        data
      });
      return xAdsTag;
   } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

  // Estatísticas da campanha
  static async getCampaignStats(campaignId: string) {
    try {
      const stats = await prisma.event.groupBy({
        by: ['eventName'],
        where: { campaignId },
        _count: {
          id: true
        },
        _sum: {
          value: true
        }
      });

      const totalEvents = await prisma.event.count({
        where: { campaignId }
      });

      const totalValue = await prisma.event.aggregate({
        where: { 
          campaignId,
          value: { not: null }
        },
        _sum: {
          value: true
        }
      });

      return {
        totalEvents,
        totalValue: totalValue._sum.value || 0,
        eventBreakdown: stats.map(stat => ({
          eventName: stat.eventName,
          count: stat._count.id,
          totalValue: stat._sum.value || 0
        }))
      };
    } catch (error) {
  if (error instanceof Error) {
    throw new Error(`Erro ao criar campanha: ${error.message}`);
  }
  throw new Error('Erro ao criar campanha: erro desconhecido');
}
  }

 static async deleteGoogleAdsTag(campaignId: string) {
    try {
      const googleAdsTag = await prisma.googleAdsTag.delete({
        where: { campaignId }
      });

      return {
        success: true,
        data: googleAdsTag
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao deletar Google Ads Tag: ${error.message}`);
      }
      throw new Error('Erro ao deletar Google Ads Tag: erro desconhecido');
    }
  }

  static async deleteMetaAdsTag(campaignId: string) {
    try {
      const metaAdsTag = await prisma.metaAdsTag.delete({
        where: { campaignId }
      });

      return {
        success: true,
        data: metaAdsTag
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao deletar Meta Ads Tag: ${error.message}`);
      }
      throw new Error('Erro ao deletar Meta Ads Tag: erro desconhecido');
    }
  }
  static async getGoogleAdsTag(campaignId: string) {
    try {
      const googleAdsTag = await prisma.googleAdsTag.findUnique({
        where: { campaignId }
      });

      if (!googleAdsTag) {
        throw new Error('Google Ads Tag não encontrada');
      }

      return {
        success: true,
        data: googleAdsTag
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar Google Ads Tag: ${error.message}`);
      }
      throw new Error('Erro ao buscar Google Ads Tag: erro desconhecido');
    }
  }
  static async getXAdsTag(campaignId: string) {
    try {
      const xAdsTag = await prisma.xAdsTag.findUnique({
        where: { campaignId }
      });

      if (!xAdsTag) {
        throw new Error('X Ads Tag não encontrada');
      }

      return {
        success: true,
        data: xAdsTag
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro ao buscar X Ads Tag: ${error.message}`);
      }
      throw new Error('Erro ao buscar X Ads Tag: erro desconhecido');
    }
  }
}