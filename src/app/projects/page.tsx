import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import ProjectsClient from '@/components/ProjectsClient'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [
      { highlight: 'desc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <>
      <Header />
      <ProjectsClient projects={projects} />
    </>
  )
}