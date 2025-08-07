export interface User {
  id: number
  email: string
  name: string
  lang_native: string
  is_premium: boolean
  stripe_customer_id: string | null
  subscription_status: string | null
  subscription_renewal: Date | null
  password: string
  security_question: string | null
  security_answer_hash: string | null
  created_at: Date
  updated_at: Date
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

export interface SecurityQuestionData {
  email: string
  security_question: string
}

export interface PasswordResetData {
  email: string
  security_answer: string
  new_password: string
}

export interface SecurityQuestionSetup {
  security_question: string
  security_answer: string
}