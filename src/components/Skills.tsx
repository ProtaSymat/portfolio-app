'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const skills = {
    'Front-end': [
        'HTML5', 'CSS3', 'SASS', 'Bootstrap', 'Tailwind CSS',
        'JavaScript', 'TypeScript', 'React', 'Angular', 'Next.js',
        'Gulp', 'Vite', 'Parcel', 'Framer Motion', 'Three.js'
    ],
    'Back-end': [
        'PHP', 'SQL', 'MySQL', 'PostgreSQL', 'NoSQL',
        'Symfony', 'CakePHP', 'Laravel', 'Node.js', 'NestJS',
        'Prisma', 'Postman', 'Docker', 'Jenkins', 'Git',
        'WordPress', 'Shopify', 'Wix', 'REST API'
    ],
    'Autres': [
        'Lua', 'Microservices', 'CI/CD', 'Agile', 'Scrum',
        'Figma', 'UX/UI', 'InDesign', 'Photoshop', 'Illustrator'
    ]
}

export default function Skills() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sectionRef = useRef<HTMLElement>(null)
    const mouseRef = useRef({ x: 0, y: 0 })
    const headRef = useRef<THREE.Object3D | null>(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
        camera.position.set(0, 0, -4)
        camera.rotation.y = Math.PI

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)

        const ambient = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambient)
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
        dirLight.position.set(5, 5, -5)
        scene.add(dirLight)
        const rimLight = new THREE.DirectionalLight(0x8B0909, 0.8)
        rimLight.position.set(-5, 0, -3)
        scene.add(rimLight)

        const loader = new GLTFLoader()
        loader.load('/assets/head_base_mesh.glb', (gltf) => {
            const head = gltf.scene
            head.scale.set(0.75, 0.75, 0.75)
            head.position.set(0, 0.25, 0)
            head.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                        color: 0x8B0909,
                        roughness: 0.6,
                        metalness: 0.1,
                    })
                }
            })
            scene.add(head)
            headRef.current = head
        })

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
                y: -((e.clientY - rect.top) / rect.height - 0.5) * 2
            }
        }

        const section = sectionRef.current

        if (section) {
            section.addEventListener('mousemove', handleMouseMove)
        }

        const handleMouseLeave = () => {
            mouseRef.current = { x: 0, y: 0 }
        }

        if (section) {
            section.addEventListener('mouseleave', handleMouseLeave)
        }

        let frameId: number
        const animate = () => {
            frameId = requestAnimationFrame(animate)
            if (headRef.current) {
                const targetX = mouseRef.current.y * 0.4
                const targetY = mouseRef.current.x * 0.6

                headRef.current.rotation.x += (targetX - headRef.current.rotation.x) * 0.05
                headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.05

                headRef.current.rotation.x = THREE.MathUtils.clamp(headRef.current.rotation.x, -0.3, 0.3)
                headRef.current.rotation.y = THREE.MathUtils.clamp(headRef.current.rotation.y, Math.PI - 3, Math.PI + 3)
            }
            renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(frameId)
            if (section) {
                section.removeEventListener('mousemove', handleMouseMove)
                section.removeEventListener('mouseleave', handleMouseLeave)
            }
            window.removeEventListener('resize', handleResize)
            renderer.dispose()
        }
    }, [])

    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#212120" fillOpacity="1" d="M0,64L60,96C120,128,240,192,360,197.3C480,203,600,149,720,144C840,139,960,181,1080,213.3C1200,245,1320,267,1380,277.3L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
            </svg>

            <section ref={sectionRef} className="relative w-full bg-primary -mt-2 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

                    <div className="w-full md:w-1/2 flex justify-center items-center">
                        <canvas
                            ref={canvasRef}
                            className="w-full max-w-sm"
                            style={{ height: '600px' }}
                        />
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-10">
                        {Object.entries(skills).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-secondary font-akira text-xl mb-4 italic">
                                    {category}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 border border-secondary text-secondary text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-secondary hover:text-primary transition-colors duration-200 cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            <svg className="w-full block -mt-25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#212120" fillOpacity="1" d="M0,192L48,192C96,192,192,192,288,197.3C384,203,480,213,576,202.7C672,192,768,160,864,138.7C960,117,1056,107,1152,101.3C1248,96,1344,96,1392,96L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
            </svg>
        </>
    )
}