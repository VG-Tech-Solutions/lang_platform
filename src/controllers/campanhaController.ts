// src/controllers/campaignController.ts
import { Request, Response } from 'express';
import { CampaignService } from '../services/interface/campanhas';
import { Platform, CampaignStatus } from '../generated/prisma';

export class CampaignController {
  // POST /campaigns
  static async createCampaign(req: Request, res: Response) {
    try {
      const {
        name,
        platform,
        status,
        startDate,
        endDate,
        budget,
        currency,
        createdBy
      } = req.body;

      // Validações
      if (!name || !platform) {
        return res.status(400).json({
          error: 'Nome e plataforma são obrigatórios'
        });
      }

      if (!Object.values(Platform).includes(platform)) {
        return res.status(400).json({
          error: 'Plataforma inválida. Use: GOOGLE_ADS, META_ADS ou X_ADS'
        });
      }

      const campaign = await CampaignService.createCampaign({
        name,
        platform,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        budget,
        currency,
        createdBy
      });

      res.status(201).json({
        success: true,
        data: campaign
      });
    } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // GET /campaigns
  static async getCampaigns(req: Request, res: Response) {
    try {
      const {
        platform,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 10
      } = req.query;

      const filters: any = {};
      if (platform) filters.platform = platform as Platform;
      if (status) filters.status = status as CampaignStatus;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      filters.page = parseInt(page as string);
      filters.limit = parseInt(limit as string);

      const result = await CampaignService.getCampaigns(filters);

      res.json({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
  } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // GET /campaigns/:id
  static async getCampaignById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const campaign = await CampaignService.getCampaignById(id);

      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // PUT /campaigns/:id
  static async updateCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Converter datas se fornecidas
      if (updateData.startDate) {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate) {
        updateData.endDate = new Date(updateData.endDate);
      }

      const campaign = await CampaignService.updateCampaign(id, updateData);

      res.json({
        success: true,
        data: campaign
      });
   } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // DELETE /campaigns/:id
  static async deleteCampaign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await CampaignService.deleteCampaign(id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // POST /campaigns/:id/google-ads-tag
  static async addGoogleAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tagData = req.body;

      if (!tagData.utm_campaign) {
        return res.status(400).json({
          error: 'utm_campaign é obrigatório'
        });
      }

      const googleAdsTag = await CampaignService.addGoogleAdsTag(id, tagData);

      res.status(201).json({
        success: true,
        data: googleAdsTag
      });
    } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // POST /campaigns/:id/meta-ads-tag
  static async addMetaAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tagData = req.body;

      if (!tagData.utm_campaign) {
        return res.status(400).json({
          error: 'utm_campaign é obrigatório'
        });
      }

      const metaAdsTag = await CampaignService.addMetaAdsTag(id, tagData);

      res.status(201).json({
        success: true,
        data: metaAdsTag
      });
    } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // POST /campaigns/:id/x-ads-tag
  static async addXAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tagData = req.body;

      if (!tagData.utm_campaign) {
        return res.status(400).json({
          error: 'utm_campaign é obrigatório'
        });
      }

      const xAdsTag = await CampaignService.addXAdsTag(id, tagData);

      res.status(201).json({
        success: true,
        data: xAdsTag
      });
   } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // PUT /campaigns/:id/google-ads-tag
  static async updateGoogleAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tagData = req.body;

      const googleAdsTag = await CampaignService.updateGoogleAdsTag(id, tagData);

      res.json({
        success: true,
        data: googleAdsTag
      });
   
   } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // PUT /campaigns/:id/meta-ads-tag
  static async updateMetaAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tagData = req.body;

      const metaAdsTag = await CampaignService.updateMetaAdsTag(id, tagData);

      res.json({
        success: true,
        data: metaAdsTag
      });
    } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // PUT /campaigns/:id/x-ads-tag
  static async updateXAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tagData = req.body;

      const xAdsTag = await CampaignService.updateXAdsTag(id, tagData);

      res.json({
        success: true,
        data: xAdsTag
      });
   } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // DELETE /campaigns/:id/google-ads-tag
  static async deleteGoogleAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await CampaignService.deleteGoogleAdsTag(id);

        res.json({
            success: true,
            message: 'Google Ads tag removida com sucesso'
        });
    } catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Erro desconhecido no servidor' });
  }
}

  }

  // DELETE /campaigns/:id/meta-ads-tag
  static async deleteMetaAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await CampaignService.deleteMetaAdsTag(id);

      res.json({
        success: true,
        message: 'Meta Ads tag removida com sucesso'
      });
    } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
  }
  // DELETE /campaigns/:id/x-ads-tag
  static async deleteXAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await CampaignService.deleteMetaAdsTag(id);

      res.json({
        success: true,
        message: 'X Ads tag removida com sucesso'
      });
    } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro desconhecido no servidor' });
    }
  }
}
  // GET /campaigns/:id/stats
  static async getCampaignStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stats = await CampaignService.getCampaignStats(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido no servidor' });
      }
    }
  }

  // GET /campaigns/:id/google-ads-tag
  static async getGoogleAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tag = await CampaignService.getGoogleAdsTag(id);

      res.json({
        success: true,
        data: tag
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido no servidor' });
      }
    }
  }

  // GET /campaigns/:id/meta-ads-tag
  static async getMetaAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tag = await CampaignService.getGoogleAdsTag(id);

      res.json({
        success: true,
        data: tag
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido no servidor' });
      }
    }
  }

  // GET /campaigns/:id/x-ads-tag
  static async getXAdsTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tag = await CampaignService.getXAdsTag(id);

      res.json({
        success: true,
        data: tag
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Erro desconhecido no servidor' });
      }
    }
  }
}