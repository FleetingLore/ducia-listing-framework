import React, { useState, useEffect, useRef } from 'react'

export default function Header({ siteName, isAdmin, onAdminClick, onUpload }) {
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current
      
      // 在顶部时始终显示
      if (currentScrollY <= 10) {
        setIsVisible(true)
        lastScrollYRef.current = currentScrollY
        return
      }
      
      // 只有向上滚动时才显示
      if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      } 
      // 只有向下滚动时才隐藏
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      }
      // 停止滚动时不改变状态
      
      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
