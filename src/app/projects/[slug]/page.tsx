import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import GalleryGrid from '@/components/GalleryGrid'

export default async function ProjectPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug }
  })

  if (!project) notFound()

  const nextProject = await prisma.project.findFirst({
    where: { id: { gt: project.id } },
    orderBy: { id: 'asc' } //logique nn beugué mais à revoir si jamais on veut fair du tri par date ou autre
  })

  const categoryLabel = {
    personal: 'Personal',
    professional: 'Professional',
    academic: 'Academic'
  }[project.category]

  return (
    <>
      <Header />
      <div className="min-h-screen py-12 md:py-20 px-4 md:px-6">
        <div>
          <div className="border border-primary p-6 md:p-10 lg:p-16">

            <div className="flex items-center justify-between mb-6 md:hidden">
              <Link href="/projects" className="text-primary text-sm font-semibold uppercase tracking-widest">
                ← Back
              </Link>
              {nextProject && (
                <Link href={`/projects/${nextProject.slug}`} className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
                  Next →
                </Link>
              )}
            </div>

            <div className="flex items-start justify-between mb-8 md:mb-10">
              <div className="flex-1 min-w-0">
                {project.highlight && (
                  <span className="text-xs uppercase tracking-widest text-white bg-primary px-3 py-1 mb-4 inline-block">
                    ★ Featured
                  </span>
                )}
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black font-akira text-primary mb-3 leading-tight break-words">
                  {project.title}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-xs md:text-sm uppercase tracking-widest text-slate-500 font-semibold">
                    {categoryLabel}
                  </span>
                  {project.year && (
                    <span className="text-xs md:text-sm text-slate-400">· {project.year}</span>
                  )}
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end gap-4 min-w-fit ml-8">
                <Link href="/projects" className="flex items-center gap-2 text-primary hover:underline text-sm font-semibold uppercase tracking-widest">
                  ← Back
                </Link>
                {nextProject && (
                  <Link href={`/projects/${nextProject.slug}`} className="flex items-center gap-2 text-slate-400 hover:text-primary hover:underline text-sm font-semibold uppercase tracking-widest transition-colors text-right">
                    Next: {nextProject.title} →
                  </Link>
                )}
              </div>
            </div>

            {project.techStack.length > 0 && (
              <div className="mb-8 md:mb-10">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="px-3 md:px-4 py-1.5 md:py-2 border border-primary text-primary text-xs md:text-sm font-semibold uppercase tracking-wide">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-8 md:mb-10">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" // revoir p-e icon
                  className="px-4 md:px-6 py-2.5 md:py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-all font-semibold uppercase tracking-widest text-xs md:text-sm">
                  GitHub
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="px-4 md:px-6 py-2.5 md:py-3 bg-primary text-white hover:opacity-80 transition-all font-semibold uppercase tracking-widest text-xs md:text-sm">
                  Live Demo →
                </a>
              )}
            </div>

            {project.description && (
              <>
                <div className="border-t border-primary my-8 md:my-10" />
                <div className="mb-8 md:mb-10">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3 md:mb-4">Description</p>
                  <p className="text-sm md:text-lg text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: project.description }} />
                </div>
              </>
            )}

            {project.images.length > 0 && (
              <GalleryGrid images={project.images} title={project.title} />
            )}

            {nextProject && (
              <div className="mt-10 pt-6 border-t border-primary md:hidden">
                <Link href={`/projects/${nextProject.slug}`} className="flex items-center justify-between text-slate-400 hover:text-primary transition-colors">
                  <span className="text-xs uppercase tracking-widest font-semibold">Next project</span>
                  <span className="text-sm font-semibold uppercase tracking-widest">{nextProject.title} →</span>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}