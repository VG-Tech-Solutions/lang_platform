

import { z } from 'zod';


// Esquemas de validação
export const createCampaignSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  platform: z.enum(['GOOGLE_ADS', 'META_ADS', 'X_ADS']),
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'DRAFT']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  createdBy: z.string().optional()
});

export const createEventSchema = z.object({
  campaignId: z.string().optional(),
  eventName: z.string().min(1, 'eventName é obrigatório'),
  eventAction: z.string().optional(),
  eventCategory: z.string().optional(),
  eventLabel: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().length(3).optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  referrer: z.string().optional(),
  gaClientId: z.string().optional(),
  ga4MeasurementId: z.string().optional(),
  pageUrl: z.string().url().optional(),
  pageTitle: z.string().optional(),
  eventTime: z.string().datetime().optional()
});

export const googleAdsTagSchema = z.object({
  gclid: z.string().optional(),
  utm_campaign: z.string().min(1, 'utm_campaign é obrigatório'),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  adGroupId: z.string().optional(),
  keywordId: z.string().optional(),
  creativeId: z.string().optional()
});

export const metaAdsTagSchema = z.object({
  fbclid: z.string().optional(),
  utm_campaign: z.string().min(1, 'utm_campaign é obrigatório'),
  utm_content: z.string().optional(),
  adSetId: z.string().optional(),
  adId: z.string().optional(),
  placement: z.string().optional()
});

export const xAdsTagSchema = z.object({
  twclid: z.string().optional(),
  utm_campaign: z.string().min(1, 'utm_campaign é obrigatório'),
  utm_content: z.string().optional(),
  tweetId: z.string().optional(),
  lineItemId: z.string().optional()
});




