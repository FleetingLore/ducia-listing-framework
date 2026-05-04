import React from 'react'
import { useStickyHeader } from '../hooks/useStickyHeader'

export default function DocHeader({ title, isAdmin, onHome, onDownload }) {
  const { headerRef, isSticky } = useStickyHeader()
  const iconSrc = isAdmin ? '/icons/user.svg' : '/icons/home.svg'
  
  return (
    <div ref={headerRef} className={`menu-bar ${isSticky ? 'sticky' : ''}`}>
      <div className="left-buttons">
        <button className="icon-button" onClick={onHome}>
          <img src={iconSrc} alt={isAdmin ? "Admin" : "Home"} width="20" height="20" />
        </button>
      </div>
      <h1 className="menu-title">{title}</h1>
      <div className="right-buttons">
        <button className="icon-button" onClick={onDownload}>
          <img src="/icons/download.svg" alt="Download" width="18" height="18" />
        </button>
      </div>
    </div>
  )
}
