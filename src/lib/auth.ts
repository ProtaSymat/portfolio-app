import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      adminId: string
      email: string
    }
    return decoded
  } catch {
    return null
  }
}