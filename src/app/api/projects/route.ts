import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const techStack = typeof body.techStack === 'string' 
      ? body.techStack.split(',').map(t => t.trim()).filter(Boolean)
      : body.techStack || []

    const images = Array.isArray(body.images) 
      ? body.images.filter(Boolean) 
      : []

    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        techStack,
        images,
        githubUrl: body.githubUrl || null,
        thumbnail: body.thumbnail || null,
        category: body.category || 'personal',
        highlight: body.highlight || false,
      }
    })

    return NextResponse.json({ 
      success: true, 
      project 
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Erreur création projet' 
    }, { status: 500 })
  }
}