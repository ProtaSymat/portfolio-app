'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST'
    })
    router.push('/admin/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary py-2 border-b border-white">
      <div className="mx-5 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/logo-white.svg" alt="Admin" className="w-8 h-8 object-contain" />
        </Link>
        <nav className="flex space-x-10 items-center">
          <Link href="/projects" className="text-white font-neue-semibold text-md">
            work
          </Link>
          <Link href="/" className="text-white font-neue-semibold text-md">
            see website
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">
            logout
          </button>
        </nav>
      </div>
    </header>
  )
}