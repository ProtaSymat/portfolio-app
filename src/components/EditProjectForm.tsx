'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminHeader from './AdminHeader'

interface Project {
  id: number
  title: string
  slug: string
  description: string
  techStack: string[]
  images: string[]
  githubUrl: string | null
  liveUrl: string | null
  thumbnail: string | null
  category: 'personal' | 'professional' | 'academic'
  year: number | null
  highlight: boolean
}

export default function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: project.title,
    slug: project.slug,
    description: project.description,
    techStack: project.techStack.join(', '),
    images: project.images.join(', '),
    githubUrl: project.githubUrl || '',
    liveUrl: project.liveUrl || '',
    category: project.category,
    year: project.year?.toString() || '',
    highlight: project.highlight
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const techStackArray = formData.techStack
      .split(',').map(t => t.trim()).filter(t => t)

    const imagesArray = formData.images
      .split(',').map(i => i.trim()).filter(i => i)

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          techStack: techStackArray,
          images: imagesArray
        })
      })

      const data = await res.json()
      
      if (data.success) {
        alert('Projet modifié avec succès !')
        router.push('/admin/dashboard')
      } else {
        alert(`Erreur: ${data.error || 'Erreur inconnue'}`)
      }
    } catch (error) {
      alert('Erreur réseau')
    }
  }

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-12 text-center">Modifier le projet</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Titre</label>
              <input type="text" value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Slug (URL interne)</label>
                <input type="text" value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Catégorie</label>
                <select value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as Project['category']})}
                  className="w-full p-4 bg-slate-800 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="personal">Personnel</option>
                  <option value="professional">Professionnel</option>
                  <option value="academic">Académique</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack</label>
                <input type="text" value={formData.techStack}
                  onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="React, TypeScript, ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Année</label>
                <input type="number" value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="2024" min="2000" max="2100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-vertical"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Images <span className="text-slate-500 text-xs">(URLs séparées par des virgules)</span>
              </label>
              <textarea value={formData.images}
                onChange={(e) => setFormData({...formData, images: e.target.value})}
                rows={3}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 resize-vertical"
                placeholder="https://res.cloudinary.com/..., https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">GitHub</label>
                <input type="url" value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Live Demo</label>
                <input type="url" value={formData.liveUrl}
                  onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
                  placeholder="https://monprojet.vercel.app"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input type="checkbox" id="highlight" checked={formData.highlight}
                onChange={(e) => setFormData({...formData, highlight: e.target.checked})}
                className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
              />
              <label htmlFor="highlight" className="text-slate-300 font-medium">Mettre en avant</label>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => router.push('/admin/dashboard')}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-6 px-8 rounded-2xl text-lg transition-all">
                Annuler
              </button>
              <button type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-2xl text-lg transition-all">
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}