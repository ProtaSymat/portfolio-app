import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/AdminHeader'
import DeleteButton from '@/components/DeleteButton'
type Project = Awaited<ReturnType<typeof prisma.project.findMany>>[number]

export default async function AdminDashboard() {
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

  const projects = await prisma.project.findMany({
    orderBy: [
      { highlight: 'desc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen py-20 px-6 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h1 className="text-5xl font-bold text-white">Dashboard Admin</h1>
            <a 
              href="/admin" 
              className="px-6 py-3 bg-white hover:bg-gray-100 text-primary font-bold rounded-xl transition-colors"
            >
              + Nouveau Projet
            </a>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400 mb-8">Aucun projet pour l'instant</p>
              <a 
                href="/admin" 
                className="px-8 py-4 bg-white hover:bg-gray-100 text-primary font-bold rounded-xl inline-block"
              >
                Ajouter mon premier projet
              </a>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: Project) => (
                <div 
                  key={project.id} 
                  className="bg-primary rounded-2xl p-8 border border-white hover:border-gray-300 hover:shadow-2xl transition-all duration-300"
                >
                  {project.highlight && (
                    <span className="inline-block px-3 py-1 bg-yellow-400 text-primary rounded-full text-sm font-semibold mb-4">
                      ⭐ Highlight
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                  <p className="text-gray-400 mb-6">{project.description}</p>
                  
                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <a 
                      href={`/admin/project/${project.id}/edit`}
                      className="flex-1 text-center py-3 px-4 border border-white hover:bg-white hover:text-primary text-white rounded-xl transition-colors"
                    >
                      Modifier
                    </a>
                    <DeleteButton projectId={project.id.toString()} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}