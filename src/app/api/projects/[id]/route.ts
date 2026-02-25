import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    })
    if (!project) return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 })
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const techStack = typeof body.techStack === 'string'
      ? body.techStack.split(',').map(t => t.trim()).filter(Boolean)
      : body.techStack || []

    const images = Array.isArray(body.images)
      ? body.images.filter(Boolean)
      : []

    const project = await prisma.project.update({
  where: { id: parseInt(id) },
  data: {
    title: body.title,
    slug: body.slug,
    description: body.description,
    techStack,
    images,
    githubUrl: body.githubUrl || null,
    liveUrl: body.liveUrl || null,
    thumbnail: body.thumbnail || null,
    category: body.category || 'personal',
    year: body.year ? parseInt(body.year) : null,
    highlight: body.highlight || false,
  }
})

    return NextResponse.json({ success: true, project })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.project.delete({
      where: { id: parseInt(id) }
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}