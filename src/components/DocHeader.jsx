import React, { useState, useEffect, useRef } from 'react'

export default function DocHeader({ title, isAdmin, onHome, onDownload }) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const lastScrollY = lastScrollYRef.current
        
        if (currentScrollY <= 10) {
          setIsVisible(true)
          lastScrollYRef.current = currentScrollY
          return
        }
        
        const scrollDelta = currentScrollY - lastScrollY
        
        if (Math.abs(scrollDelta) < 20) {
          lastScrollYRef.current = currentScrollY
          return
        }
        
        if (scrollDelta < 0) {
          setIsVisible(true)
        } else if (scrollDelta > 0) {
          setIsVisible(false)
        }
        
        lastScrollYRef.current = currentScrollY
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const iconSrc = isAdmin ? '/icons/user.svg' : '/icons/home.svg'
  
  return (
    <div className={`rust-header ${isVisible ? '' : 'hidden'}`}>
      <div className="rust-header-left">
        <button className="rust-icon-btn" onClick={onHome}>
          <img src={iconSrc} alt={isAdmin ? "Admin" : "Home"} width="20" height="20" />
        </button>
      </div>
      <div className="rust-header-center">
        <span>{title}</span>
      </div>
      <div className="rust-header-right">
        <button className="rust-icon-btn" onClick={onDownload}>
          <img src="/icons/download.svg" alt="Download" width="18" height="18" />
        </button>
      </div>
    </div>
  )
}
