import React, { useState, useEffect, useRef } from 'react'

export default function Header({ siteName, isAdmin, onAdminClick, onUpload }) {
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
        
        // 在顶部时始终显示
        if (currentScrollY <= 10) {
          setIsVisible(true)
          lastScrollYRef.current = currentScrollY
          return
        }
        
        // 滚动阈值：需要滚动超过 30px 才触发
        const scrollDelta = currentScrollY - lastScrollY
        
        if (Math.abs(scrollDelta) < 20) {
          // 滚动距离太小，不改变状态
          lastScrollYRef.current = currentScrollY
          return
        }
        
        if (scrollDelta < 0) {
          // 向上滚动，显示
          setIsVisible(true)
        } else if (scrollDelta > 0) {
          // 向下滚动，隐藏
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
        <button className="rust-icon-btn" onClick={onAdminClick}>
          <img src={iconSrc} alt={isAdmin ? "Admin" : "Home"} width="20" height="20" />
        </button>
      </div>
      <div className="rust-header-center">
        <span>{siteName}</span>
      </div>
      <div className="rust-header-right">
        <label className="rust-icon-btn" style={{ cursor: "pointer" }}>
          <img src="/icons/upload.svg" alt="Upload" width="18" height="18" />
          <input type="file" accept=".md" onChange={onUpload} style={{ display: "none" }} />
        </label>
      </div>
    </div>
  )
}
