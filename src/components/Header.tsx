'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header({ isUnlocked = true }: { isUnlocked?: boolean }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const shouldShow = !isHomePage || isUnlocked

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-primary py-2 transition-transform duration-400 ease-in-out ${shouldShow ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="mx-5 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/logo-white.svg" alt="Mathys" className="w-8 h-8 object-contain" />
        </Link>
        <nav className="flex space-x-10 items-center">
          <Link href="/projects" className="text-white font-neue-semibold text-md">
            work
          </Link>
          <Link href="/#contact" className="text-white font-neue-semibold text-base">
            contact
          </Link>
        </nav>
      </div>
    </header>
  )
}