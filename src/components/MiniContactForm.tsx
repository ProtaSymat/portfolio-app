'use client'
import { useState } from 'react'
import Image from 'next/image'
import emailjs from '@emailjs/browser'

export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const newErrors: Record<string, string> = {}
    if (formData.name.length < 2) newErrors.name = 'Au moins 2 caractères'
    if (formData.name.length > 50) newErrors.name = 'Max 50 caractères'
    if (!emailRegex.test(formData.email)) newErrors.email = 'Email invalide'
    if (formData.message.length < 10) newErrors.message = 'Au moins 10 caractères'
    if (formData.message.length > 2000) newErrors.message = 'Max 2000 caractères'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { name: formData.name, email: formData.email, message: formData.message },
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      )
      setIsLoading(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 4000)
    } catch (error) {
      console.error('Erreur:', error)
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="relative w-full max-w-3xl mx-auto px-6 py-16 bg-secondary overflow-hidden">
        <div className="text-center py-10">
          <h2 className="contact-title">SENT ✓</h2>
          <p className="font-neue text-base mt-3 text-primary/70">I'll get back to you very soon!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full max-w-3xl mx-auto px-6 pt-14 pb-20 bg-secondary overflow-hidden">

      <h2 className="contact-title relative z-10 mb-6 text-center">CONTACT</h2>

      <form onSubmit={handleSubmit} noValidate className="relative z-[5] flex flex-col px-5">
        <div className="d-flex">
        <div className="w-60">
          <div className="field-wrap field-wrap--name w-50 self-start z-[3]">
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name :" autoComplete="name" className={`field-input${errors.name ? ' border-red-600' : ''}`}/>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
        </div>
        
        <div className="w-80 mt-5">
          <div className="field-wrap field-wrap--email w-3/4 self-center z-[2]">
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email :" autoComplete="email" className={`field-input${errors.email ? ' border-red-600' : ''}`}/>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
        </div>
        </div>

        <div className="relative w-full self-center z-[1] mt-5">
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Message :" rows={6} className={`field-input field-wrap field-wrap--message resize-none min-h-[150px]${errors.message ? ' border-red-600' : ''}`}/>
          {errors.message && <span className="field-error">{errors.message}</span>}
          <div className="send-btn mt-4">
            <button type="submit" disabled={isLoading} aria-label="Envoyer le message" className="w-fit text-secondary font-akira gap-1.5 whitespace-nowrap bg-primary text-sm px-5 py-2.5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"> 
            {isLoading ? <span className="inline-block border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" /> : <>SEND →</>}
          </button>
          </div>
        </div>
      </form>
    </section>
  )
}