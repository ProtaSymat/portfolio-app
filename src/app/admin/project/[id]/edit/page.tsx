export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import EditProjectForm from '@/components/EditProjectForm'

export default async function EditProjectPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) {
    redirect('/admin/login')
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    redirect('/admin/login')
  }

  const { id } = await params

  const project = await prisma.project.findUnique({
  where: { id: parseInt(id) }
})

  if (!project) {
    redirect('/admin/dashboard')
  }

  return <EditProjectForm project={project} />
}