import { Request, Response } from 'express';
import StripeService from '../services/interface/stripeService';
import { CreateCheckoutRequest, BillingPortalRequest } from '../types/stripe';

class StripeController {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  /**
   * POST /checkout - Cria checkout session
   */
  createCheckout = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateCheckoutRequest = req.body;

      const result = await this.stripeService.createCheckoutSession(data);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erro no checkout:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  };

  /**
   * GET /billing-portal - Cria billing portal session
   */
  createBillingPortal = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: BillingPortalRequest = req.query as any;

      const result = await this.stripeService.createBillingPortalSession(data);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erro no billing portal:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  };

  /**
   * POST /webhooks/stripe - Processa webhooks
   */
  handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        res.status(400).json({ error: 'Assinatura do webhook ausente' });
        return;
      }

      // O body vem como Buffer quando usando express.raw()
      const body = req.body as Buffer;

      await this.stripeService.handleWebhook(body, signature);

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erro no webhook',
      });
    }
  };
}

export default StripeController;