import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
console.log('URL:', process.env.SUPABASE_URL)
console.log('ANON:', process.env.SUPABASE_ANON_KEY)
console.log('SERVICE:', process.env.SUPABASE_SERVICE_ROLE_KEY)
// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

// Cliente com service role para operações administrativas
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Cliente público para verificação de tokens
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Supabase configurado com sucesso')