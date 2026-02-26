import { prisma } from '@/lib/prisma'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
  const highlights = await prisma.project.findMany({
    where: { highlight: true },
    select: { images: true, slug: true, title: true }
  })

  const highlightImages = highlights
  .filter((p: any) => p.images.length > 0)
  .map((p: any) => ({ src: p.images[0], slug: p.slug, title: p.title }))

  return <HomeClient highlightImages={highlightImages} />
}