



import Stripe from 'stripe';
import { CreateCheckoutRequest, CheckoutResponse, BillingPortalRequest, BillingPortalResponse, SubscriptionData,  } from '../../types/stripe';

class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
     apiVersion: '2025-06-30.basil', 
      typescript: true, // Habilita tipos TypeScript aprimorados
    });
    
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  /**
   * Cria ou reutiliza um cliente Stripe
   */
  private async getOrCreateCustomer(userId: string, email: string): Promise<string> {
    try {
      // Primeiro, tenta encontrar cliente existente por email
      const existingCustomers = await this.stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0].id;
      }

      // Se não encontrar, cria novo cliente
      const customer = await this.stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });

      return customer.id;
    } catch (error) {
      console.error('Erro ao criar/buscar cliente Stripe:', error);
      throw new Error('Falha ao processar cliente');
    }
  }

  /**
   * Cria uma Checkout Session
   */
  async createCheckoutSession(data: CreateCheckoutRequest): Promise<CheckoutResponse> {
    try {
      if (!data.userId && !data.email) {
        throw new Error('userId ou email é obrigatório');
      }

      if (!data.priceId) {
        throw new Error('priceId é obrigatório');
      }

      // Se tiver userId, busca email no banco (implementar conforme sua estrutura)
      let email = data.email;
      if (data.userId && !email) {
        // Aqui você buscaria o email do usuário no seu banco de dados
        // email = await this.getUserEmailById(data.userId);
        throw new Error('Email é obrigatório quando userId for fornecido');
      }

      const customerId = await this.getOrCreateCustomer(data.userId || 'anonymous', email!);

      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: data.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: data.returnUrl || `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: data.returnUrl || `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
          userId: data.userId || '',
        },
        subscription_data: {
          metadata: {
            userId: data.userId || '',
          },
        },
      });

      if (!session.url) {
        throw new Error('Falha ao gerar URL da sessão');
      }

      return {
        checkoutUrl: session.url,
      };
    } catch (error) {
      console.error('Erro ao criar checkout session:', error);
      throw error;
    }
  }

  /**
   * Cria um link para o Billing Portal
   */
  async createBillingPortalSession(data: BillingPortalRequest): Promise<BillingPortalResponse> {
    try {
      let customerId = data.stripeCustomerId;

      // Se não tiver customerId, busca pelo userId
      if (!customerId && data.userId) {
        // Aqui você buscaria o stripeCustomerId no seu banco de dados
        // customerId = await this.getStripeCustomerIdByUserId(data.userId);
        throw new Error('stripeCustomerId não encontrado para este usuário');
      }

      if (!customerId) {
        throw new Error('stripeCustomerId ou userId é obrigatório');
      }

      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: process.env.FRONTEND_URL || 'http://localhost:3000/dashboard',
      });

      return {
        url: session.url,
      };
    } catch (error) {
      console.error('Erro ao criar billing portal session:', error);
      throw error;
    }
  }

  /**
   * Processa webhooks do Stripe
   */
  async handleWebhook(body: string | Buffer, signature: string): Promise<void> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.webhookSecret
      );

      console.log(`Webhook recebido: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          console.log(`Evento não tratado: ${event.type}`);
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      throw error;
    }
  }

  /**
   * Trata checkout completado
   */
  private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    try {
      if (session.mode === 'subscription' && session.subscription) {
        const subscriptionId = typeof session.subscription === 'string' 
          ? session.subscription 
          : session.subscription.id;

        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

        const subscriptionData: SubscriptionData = {
          userId: session.metadata?.userId || '',
          stripeCustomerId: session.customer as string,
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.billing_cycle_anchor * 1000),
          currentPeriodEnd: new Date(subscription.billing_cycle_anchor * 1000),
          priceId: subscription.items.data[0].price.id,
        };

        // Aqui você salvaria no banco de dados
        // await this.saveSubscription(subscriptionData);
        console.log('Assinatura criada:', subscriptionData);
      }
    } catch (error) {
      console.error('Erro ao processar checkout completado:', error);
    }
  }

  /**
   * Trata atualização de assinatura
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    try {
      const subscriptionData = {
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.billing_cycle_anchor * 1000),
        currentPeriodEnd: new Date(subscription.billing_cycle_anchor * 1000),
        priceId: subscription.items.data[0].price.id,
      };

      // Aqui você atualizaria no banco de dados
      // await this.updateSubscription(subscription.id, subscriptionData);
      console.log('Assinatura atualizada:', subscriptionData);
    } catch (error) {
      console.error('Erro ao processar atualização de assinatura:', error);
    }
  }

  /**
   * Trata cancelamento de assinatura
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    try {
      // Aqui você marcaria a assinatura como cancelada no banco
      // await this.cancelSubscription(subscription.id);
      console.log('Assinatura cancelada:', subscription.id);
    } catch (error) {
      console.error('Erro ao processar cancelamento de assinatura:', error);
    }
  }

  /**
   * Trata pagamento bem-sucedido
   */
  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    try {
      if (invoice) {
        // Aqui você atualizaria o status de pagamento
        console.log('Pagamento bem-sucedido para assinatura:', invoice);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento bem-sucedido:', error);
    }
  }

  /**
   * Trata falha no pagamento
   */
  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    try {
      if (invoice) {
        // Aqui você trataria a falha no pagamento
        console.log('Falha no pagamento para assinatura:', invoice);
      }
    } catch (error) {
      console.error('Erro ao processar falha no pagamento:', error);
    }
  }
}

export default StripeService;