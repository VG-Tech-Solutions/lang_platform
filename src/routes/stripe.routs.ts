

import { Router } from 'express';
import StripeController from '../controllers/stripeController';
import express from 'express';

const router = Router();
const stripeController = new StripeController();

// Middleware para webhooks (raw body necessário)
const webhookMiddleware = express.raw({ type: 'application/json' });

// Rotas
router.post('/checkout', stripeController.createCheckout);
router.get('/billing-portal', stripeController.createBillingPortal);
router.post('/webhooks/stripe', webhookMiddleware, stripeController.handleWebhook);

export default router;