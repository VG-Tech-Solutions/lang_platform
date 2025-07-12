export interface User {
  id: string
  email: string
  name: string
  lang_native: string
  is_premium: boolean
  stripe_customer_id?: string | null
  subscription_status?: string | null
  subscription_renewal?: Date | null
  created_at?: Date
  updated_at?: Date
  password: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
    provider?: string
  }
}

export interface CreateUserRequest {
  email: string
  name: string
  
  lang_native: string
}

export interface UpdateUserRequest {
  name?: string
  lang_native?: string
}