'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Footer() {

  return (
    <footer className="py-2">
      <div className="text-center text-sm text-primary/70">
        © {new Date().getFullYear()} Mathys G. - All rights reserved.
      </div>
    </footer>
  )
}