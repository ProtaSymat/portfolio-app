import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'

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
    orderBy: { id: 'asc' }
  })

  const categoryLabel = {
    personal: 'Personal',
    professional: 'Professional',
    academic: 'Academic'
  }[project.category]

  return (
    <>
      <Header />
      <div className="min-h-screen py-20 px-6">
        <div>

          <div className="border border-primary p-10 md:p-16">

            <div className="flex items-start justify-between mb-10">
              <div>
                {project.highlight && (
                  <span className="text-xs uppercase tracking-widest text-white bg-primary px-3 py-1 mb-4 inline-block">
                    ★ Featured
                  </span>
                )}
                <h1 className="text-5xl md:text-7xl font-black font-akira text-primary mb-4">
                  {project.title}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm uppercase tracking-widest text-slate-500 font-semibold">
                    {categoryLabel}
                  </span>
                  {project.year && (
                    <span className="text-sm text-slate-400">· {project.year}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 min-w-fit ml-8">
                <Link
                  href="/projects"
                  className="flex items-center gap-2 text-primary hover:underline text-sm font-semibold uppercase tracking-widest"
                >
                  ← Back
                </Link>
                {nextProject && (
                  <Link
                    href={`/projects/${nextProject.slug}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary hover:underline text-sm font-semibold uppercase tracking-widest transition-colors text-right"
                  >
                    Next: {nextProject.title} →
                  </Link>
                )}
              </div>
            </div>

            {project.techStack.length > 0 && (
              <div className="mb-10">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 border border-primary text-primary text-sm font-semibold uppercase tracking-wide"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

<div className="flex gap-4 mb-10">
  {project.githubUrl && (
    <a
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-all font-semibold uppercase tracking-widest text-sm"
    >
      GitHub
    </a>
  )}
  {project.liveUrl && (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-primary text-white hover:opacity-80 transition-all font-semibold uppercase tracking-widest text-sm"
    >
      Live Demo →
    </a>
  )}
</div>

            {project.description && (
              <>
                <div className="border-t border-primary my-10" />
                <div className="mb-10">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
                    Description
                  </p>
                  <p
  className="text-lg text-slate-700 leading-relaxed"
  dangerouslySetInnerHTML={{ __html: project.description }}
/>
                </div>
              </>
            )}

           {project.images.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {project.images.map((img, i) => (
      <img
        key={i}
        src={img}
        alt={`${project.title} - image ${i + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />
    ))}
  </div>
)}


          </div>
        </div>
      </div>
    </>
  )
}