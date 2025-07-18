import { Request } from 'express';

export interface AuthenticatedRequest extends Request<{ id: string }> {
  user?: {
    id: number;
    email: string;
    name: string;
    lang_native: string;
    is_premium: boolean;
    subscription_status?: string;
  };
}
