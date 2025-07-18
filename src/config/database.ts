

import { PrismaClient } from "../generated/prisma"
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Conectar ao banco
prisma.$connect()
  .then(() => console.log('✅ Conectado ao banco de dados'))
  .catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(' Erro ao conectar ao banco:', error.message)
  } else {
    console.error('Erro desconhecido:', error)
  }
})


// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma