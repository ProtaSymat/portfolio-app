'use client'

import Link from 'next/link'
import { useState } from 'react'

type Project = {
    id: number
    title: string
    slug: string
    description: string | null
    techStack: string[]
    images: string[]
    githubUrl: string | null
    liveUrl: string | null
    category: 'personal' | 'professional' | 'academic'
    year: number | null
    highlight: boolean
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const [activeYear, setActiveYear] = useState<string>('all')

    const currentYear = new Date().getFullYear()
    const years = [...new Set(projects.map(p => p.year).filter(Boolean))].sort((a, b) => b! - a!)

    const filtered = projects.filter(p => {
        const categoryMatch = activeCategory === 'all' || p.category === activeCategory
        const yearMatch = activeYear === 'all' || p.year === parseInt(activeYear)
        return categoryMatch && yearMatch
    })

    const categories = [
        { value: 'all', label: 'All' },
        { value: 'personal', label: 'Personal' },
        { value: 'professional', label: 'Professional' },
        { value: 'academic', label: 'Academic' },
    ]

    const filterBtnClass = (active: boolean) =>
        `px-4 py-2 text-sm font-semibold uppercase tracking-widest transition-all duration-200 border ${active
            ? 'bg-primary text-white border-primary'
            : 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white'
        }`

    return (
        <div className="min-h-screen py-30 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-bold text-center mb-12 text-primary font-akira">
                    MY PROJECTS
                </h1>

                <div className="flex flex-col gap-4 mb-12">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(c => (
                            <button
                                key={c.value}
                                onClick={() => setActiveCategory(c.value)}
                                className={filterBtnClass(activeCategory === c.value)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    {years.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                onClick={() => setActiveYear('all')}
                                className={filterBtnClass(activeYear === 'all')}
                            >
                                All years
                            </button>
                            {years.map(year => (
                                <button
                                    key={year}
                                    onClick={() => setActiveYear(String(year))}
                                    className={filterBtnClass(activeYear === String(year))}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl text-slate-500">No projects found</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filtered.map((project) => (
                            <Link key={project.id} href={`/projects/${project.slug}`} className="cursor-pointer block group">
                                <div className="relative overflow-hidden h-64 border border-primary">
                                    {project.images.length > 0 ? (
                                        <img
                                            src={project.images[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-secondary flex items-center justify-center p-8">
                                            <img
                                                src="/logo.svg"
                                                alt="Logo"
                                                className="w-32 h-32 text-secondary fill-current"
                                            />                                        </div>
                                    )}
                                </div>

                                <div className="max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-300 ease-in-out">
                                    <div className="bg-[#8B0909] py-3 px-5">
                                        <span className="text-white font-black uppercase tracking-widest text-sm">
                                            Découvrir
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-primary p-5 h-24 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                                            {project.category}
                                        </span>
                                        {project.year && (
                                            <span className="text-xs text-slate-500">· {project.year}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
