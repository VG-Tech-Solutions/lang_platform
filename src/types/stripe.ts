
export interface CreateCheckoutRequest {
  userId?: string;
  email?: string;
  priceId: string;
  returnUrl?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface BillingPortalRequest {
  userId?: string;
  stripeCustomerId?: string;
}

export interface BillingPortalResponse {
  url: string;
}

export interface SubscriptionData {
  userId: string;
  stripeCustomerId: string;
  subscriptionId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  priceId: string;
}