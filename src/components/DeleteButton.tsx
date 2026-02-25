'use client'

import { useRouter } from 'next/navigation'

export default function DeleteButton({ projectId }: { projectId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        alert('Projet supprimé !')
        router.refresh()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch {
      alert('Erreur réseau')
    }
  }

  return (
    <button 
      onClick={handleDelete}
      className="flex-1 text-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
    >
      Supprimer
    </button>
  )
}