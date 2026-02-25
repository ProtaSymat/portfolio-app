import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('AdminPassword123', 10)
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password,
      name: 'Admin'
    }
  })
}

main()